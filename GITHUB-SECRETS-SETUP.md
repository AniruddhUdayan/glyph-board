# GitHub Secrets Setup Guide

This guide explains how to configure GitHub Secrets for automatic deployment to EC2.

## Required Secrets

You need to add **6 secrets** total to your GitHub repository.

---

## Setup Instructions

### 1. Go to GitHub Secrets Settings

1. Open your GitHub repository
2. Click **Settings** (top menu)
3. In left sidebar: **Secrets and variables** → **Actions**
4. Click **New repository secret**

---

## Secret 1: `DOCKERHUB_USERNAME`

**What it is:** Your DockerHub username

**Value:**
```
aniruddh262
```

---

## Secret 2: `DOCKERHUB_TOKEN`

**What it is:** DockerHub access token (NOT your password)

**How to get it:**
1. Go to https://hub.docker.com/
2. Click your profile → **Account Settings**
3. Click **Security** → **New Access Token**
4. Name it: `github-actions`
5. Copy the token (you'll only see it once!)

**Value:**
```
dckr_pat_xxxxxxxxxxxxxxxxxxxx
```

---

## Secret 3: `EC2_HOST`

**What it is:** Your EC2 instance public IP address

**How to get it:**
1. Go to AWS Console
2. Navigate to **EC2** → **Instances**
3. Select your instance
4. Copy **Public IPv4 address**

**Value:**
```
54.123.45.67
```

**Or use DNS name:**
```
ec2-54-123-45-67.compute-1.amazonaws.com
```

---

## Secret 4: `EC2_USERNAME`

**What it is:** SSH username for your EC2 instance

**Value depends on your AMI:**

| Operating System | Username |
|-----------------|----------|
| Ubuntu | `ubuntu` |
| Amazon Linux 2 | `ec2-user` |
| Red Hat Linux | `ec2-user` |
| Debian | `admin` |

**Most likely:**
```
ubuntu
```

---

## Secret 5: `EC2_SSH_KEY`

**What it is:** Your private SSH key (.pem file) contents

**How to get it:**

### On Windows:
```cmd
type your-key-file.pem
```

### On Mac/Linux:
```bash
cat your-key-file.pem
```

**Value:**
Copy the **ENTIRE** output, including the BEGIN and END lines:

```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
... (many more lines)
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
-----END RSA PRIVATE KEY-----
```

**⚠️ IMPORTANT:**
- Copy ALL lines including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`
- Don't add any extra spaces or newlines
- Keep it private - never commit this to your repository!

---

## Verify All Secrets Are Added

After adding all secrets, you should see:

| Name | Value (hidden) |
|------|---------------|
| DOCKERHUB_USERNAME | `***` |
| DOCKERHUB_TOKEN | `***` |
| EC2_HOST | `***` |
| EC2_USERNAME | `***` |
| EC2_SSH_KEY | `***` |

---

## One-Time EC2 Setup

Before the first deployment, you need to prepare your EC2 instance:

### 1. SSH into EC2
```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
```

### 2. Install Docker and Docker Compose
```bash
# Update system
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io docker-compose

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Allow user to run docker without sudo (optional)
sudo usermod -aG docker $USER
```

### 3. Clone Your Repository
```bash
cd ~
git clone https://github.com/YOUR_USERNAME/glyph-board.git
cd glyph-board
```

### 4. Initial Manual Deployment
```bash
# Pull images from DockerHub
sudo docker-compose -f docker-compose.prod.yml pull

# Start services
sudo docker-compose -f docker-compose.prod.yml up -d
```

### 5. Configure AWS Security Group

Make sure these ports are open:

| Port | Service | Source |
|------|---------|--------|
| 22 | SSH | Your IP or GitHub Actions IPs |
| 3001 | Backend API | 0.0.0.0/0 |
| 3002 | Frontend | 0.0.0.0/0 |
| 8081 | WebSocket | 0.0.0.0/0 |

---

## How the CI/CD Pipeline Works

### Workflow Trigger
Push to `main` branch triggers:

```
1. Build Docker Images
   ├─ Build frontend
   ├─ Build backend
   └─ Build websockets
   ↓
2. Push to DockerHub
   ├─ Push frontend image
   ├─ Push backend image
   └─ Push websockets image
   ↓
3. Deploy to EC2 (automatic)
   ├─ SSH into EC2
   ├─ Pull latest code (git pull)
   ├─ Pull latest Docker images
   ├─ Restart containers
   └─ Clean up old images
   ↓
4. Success Notification
```

### What Happens on Every Push to Main:

1. **Build Phase** (3 parallel jobs)
   - Builds all 3 Docker images
   - Pushes to DockerHub with `latest` tag

2. **Deploy Phase** (automatic)
   - SSH into your EC2 instance
   - Pull latest code from GitHub
   - Pull latest Docker images from DockerHub
   - Restart all containers with zero-downtime
   - Clean up old Docker images

3. **Notification**
   - Shows success message in GitHub Actions log

---

## Testing the Setup

### 1. Make a Small Change
```bash
# Edit any file
echo "# Test deployment" >> README.md

# Commit and push
git add .
git commit -m "test: trigger deployment"
git push origin main
```

### 2. Watch GitHub Actions
1. Go to your GitHub repo
2. Click **Actions** tab
3. You'll see the workflow running:
   - ✅ Build and Push Docker Images (3 jobs)
   - ✅ Deploy to EC2
   - ✅ Notify Success

### 3. Verify on EC2
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Check if containers are updated
sudo docker ps

# Check logs
sudo docker-compose -f ~/glyph-board/docker-compose.prod.yml logs -f
```

### 4. Check Application
Open browser: `http://YOUR_EC2_IP:3002`

---

## Troubleshooting

### Error: "Permission denied (publickey)"

**Problem:** SSH key is incorrect or has wrong permissions

**Solution:**
1. Verify you copied the ENTIRE .pem file contents
2. Make sure it includes BEGIN and END lines
3. Check EC2_USERNAME matches your AMI (ubuntu vs ec2-user)

### Error: "Host key verification failed"

**Problem:** EC2 host key not trusted

**Solution:** Update workflow to skip host key checking:

```yaml
- name: Deploy to EC2 via SSH
  uses: appleboy/ssh-action@v1.0.0
  with:
    host: ${{ secrets.EC2_HOST }}
    username: ${{ secrets.EC2_USERNAME }}
    key: ${{ secrets.EC2_SSH_KEY }}
    script_stop: false  # Add this
    # ... rest of config
```

### Error: "docker-compose: command not found"

**Problem:** Docker Compose not installed on EC2

**Solution:**
```bash
# SSH into EC2 and install
sudo apt-get install -y docker-compose

# Or use docker compose (v2)
sudo apt-get install -y docker-compose-plugin
```

### Error: "Repository not found"

**Problem:** Git repository not cloned on EC2

**Solution:**
```bash
# SSH into EC2
cd ~
git clone https://github.com/YOUR_USERNAME/glyph-board.git
```

### Deployment succeeds but app not working

**Check logs:**
```bash
# SSH into EC2
sudo docker ps  # Check if containers are running
sudo docker logs glyph-frontend
sudo docker logs glyph-backend
sudo docker logs glyph-websockets
```

**Common issues:**
- Wrong EC2 IP in docker-compose.prod.yml (lines 116-117)
- Security Group ports not open
- Out of memory (upgrade EC2 instance type)

---

## Security Best Practices

### 1. Use Elastic IP
Prevents IP changes when stopping/starting EC2:
- AWS Console → EC2 → Elastic IPs → Allocate
- Associate with your instance

### 2. Restrict SSH Access
In Security Group, change SSH source from `0.0.0.0/0` to:
- Your IP address
- GitHub Actions IP ranges

### 3. Rotate Secrets Regularly
- Change DockerHub token every 3-6 months
- Use separate SSH key just for deployments

### 4. Use GitHub Environments (Optional)
For production protection:
1. Go to Settings → Environments → New environment
2. Name it `production`
3. Add required reviewers
4. Update workflow to use environment

---

## Advanced: Multiple Environments

You can deploy to different environments:

**Staging on `develop` branch:**
```yaml
deploy-to-staging:
  if: github.ref == 'refs/heads/develop'
  # ... deploy to staging EC2
```

**Production on `main` branch:**
```yaml
deploy-to-production:
  if: github.ref == 'refs/heads/main'
  # ... deploy to production EC2
```

---

## Summary

### Quick Checklist

- [ ] Add all 5 GitHub Secrets
- [ ] EC2 has Docker installed
- [ ] Repository cloned on EC2 at `~/glyph-board`
- [ ] Security Group ports open (22, 3001, 3002, 8081)
- [ ] Manual deployment works
- [ ] Push to main and watch GitHub Actions
- [ ] Verify deployment on EC2
- [ ] Access application in browser

### After Setup

Every time you push to `main`:
1. ✅ Docker images automatically built
2. ✅ Images pushed to DockerHub
3. ✅ EC2 automatically updated
4. ✅ Application restarted with new code

**Zero manual deployment needed!** 🚀
