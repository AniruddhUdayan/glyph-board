# Glyph Board - EC2 Deployment Guide

This guide walks you through deploying Glyph Board to an AWS EC2 instance using Docker images from DockerHub.

## Prerequisites

- AWS EC2 instance running (Ubuntu/Amazon Linux recommended)
- Docker and Docker Compose installed on EC2
- Images pushed to DockerHub (done automatically via CI/CD)
- EC2 Security Group configured

---

## Step 1: Prepare Your EC2 Instance

### 1.1 SSH into Your EC2 Instance

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### 1.2 Install Docker and Docker Compose

**For Ubuntu:**
```bash
# Update package list
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose
sudo apt-get install -y docker-compose

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
```

**For Amazon Linux 2:**
```bash
# Install Docker
sudo yum update -y
sudo yum install -y docker

# Start Docker service
sudo service docker start
sudo systemctl enable docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -a -G docker ec2-user
```

### 1.3 Verify Installation

```bash
docker --version
docker-compose --version
```

---

## Step 2: Configure AWS Security Group

Open the following ports in your EC2 Security Group:

| Port | Service | Protocol | Source |
|------|---------|----------|--------|
| 22 | SSH | TCP | Your IP |
| 3001 | Backend API | TCP | 0.0.0.0/0 |
| 3002 | Frontend | TCP | 0.0.0.0/0 |
| 8081 | WebSocket | TCP | 0.0.0.0/0 |
| 5432 | PostgreSQL | TCP | 0.0.0.0/0 (optional) |

**Steps:**
1. Go to AWS Console > EC2 > Security Groups
2. Select your instance's security group
3. Click "Edit inbound rules"
4. Add the rules above
5. Save changes

---

## Step 3: Transfer Configuration Files to EC2

### Option A: Using Git (Recommended)

```bash
# On EC2 instance
cd ~
git clone https://github.com/YOUR_USERNAME/glyph-board.git
cd glyph-board
```

### Option B: Using SCP (Manual Transfer)

```bash
# On your local machine
scp -i your-key.pem docker-compose.prod.yml ubuntu@YOUR_EC2_IP:~/
scp -i your-key.pem .env.prod.example ubuntu@YOUR_EC2_IP:~/
```

---

## Step 4: Configure Environment Variables

### 4.1 Get Your EC2 Public IP

```bash
# On EC2 instance, run:
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Or check AWS Console > EC2 > Instances > Your Instance > Public IPv4 address
```

### 4.2 Create Production Environment File

```bash
# Copy example file
cp .env.prod.example .env.prod

# Edit with your values
nano .env.prod
```

### 4.3 Update Required Values

Edit `.env.prod` and replace:

```bash
# REQUIRED: Your EC2 public IP (no http:// prefix)
EC2_PUBLIC_IP=54.123.45.67  # Replace with your actual IP

# Frontend URLs (will auto-populate from EC2_PUBLIC_IP)
NEXT_PUBLIC_API_URL=http://54.123.45.67:3001
NEXT_PUBLIC_WS_URL=ws://54.123.45.67:8081

# REQUIRED: Generate secure secrets
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# REQUIRED: Change database password
POSTGRES_PASSWORD=your-secure-database-password
```

**Generate secure secrets:**
```bash
# Generate JWT secret
openssl rand -base64 32

# Generate database password
openssl rand -base64 20
```

Save and exit (Ctrl+X, then Y, then Enter in nano).

---

## Step 5: Deploy the Application

### 5.1 Pull Latest Images from DockerHub

```bash
# Pull all images (optional, docker-compose will do this automatically)
sudo docker pull aniruddh262/glyph-frontend:latest
sudo docker pull aniruddh262/glyph-backend:latest
sudo docker pull aniruddh262/glyph-websockets:latest
```

### 5.2 Start All Services

```bash
# Start in detached mode (background)
sudo docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Or with environment variables inline (if .env.prod doesn't work)
sudo EC2_PUBLIC_IP=YOUR_IP \
     JWT_SECRET=your-secret \
     POSTGRES_PASSWORD=your-password \
     NEXT_PUBLIC_API_URL=http://YOUR_IP:3001 \
     NEXT_PUBLIC_WS_URL=ws://YOUR_IP:8081 \
     docker-compose -f docker-compose.prod.yml up -d
```

### 5.3 Monitor Deployment

```bash
# Watch logs for all services
sudo docker-compose -f docker-compose.prod.yml logs -f

# Check specific service logs
sudo docker logs -f glyph-frontend
sudo docker logs -f glyph-backend
sudo docker logs -f glyph-websockets
sudo docker logs -f glyph-postgres

# Check container status
sudo docker ps
```

---

## Step 6: Verify Deployment

### 6.1 Check Service Health

```bash
# Test backend API
curl http://localhost:3001

# Test frontend (from EC2)
curl http://localhost:3002

# Check all containers are running
sudo docker ps
```

Expected output - all 5 containers should be running:
- `glyph-postgres`
- `glyph-migrate` (may show as "Exited 0" - this is normal)
- `glyph-backend`
- `glyph-websockets`
- `glyph-frontend`

### 6.2 Test from Browser

Open your browser and visit:

```
http://YOUR_EC2_PUBLIC_IP:3002
```

You should see the Glyph Board frontend!

### 6.3 Test API Endpoints

```bash
# Health check
curl http://YOUR_EC2_PUBLIC_IP:3001

# Test signup
curl -X POST http://YOUR_EC2_PUBLIC_IP:3001/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123","name":"Test User"}'
```

---

## Step 7: Maintenance Commands

### View Logs
```bash
# All services
sudo docker-compose -f docker-compose.prod.yml logs -f

# Specific service
sudo docker logs -f glyph-frontend
```

### Restart Services
```bash
# Restart all services
sudo docker-compose -f docker-compose.prod.yml restart

# Restart specific service
sudo docker restart glyph-frontend
```

### Stop Services
```bash
# Stop all services
sudo docker-compose -f docker-compose.prod.yml down

# Stop but keep database data
sudo docker-compose -f docker-compose.prod.yml down -v
```

### Update to Latest Images
```bash
# Pull latest images from DockerHub
sudo docker-compose -f docker-compose.prod.yml pull

# Recreate containers with new images
sudo docker-compose -f docker-compose.prod.yml up -d
```

### Clean Up Old Images
```bash
# Remove unused images
sudo docker image prune -a

# Remove unused volumes
sudo docker volume prune
```

---

## Troubleshooting

### Problem: Frontend shows "Cannot connect to server"

**Solution:**
- Check if backend is running: `sudo docker logs glyph-backend`
- Verify environment variables in `.env.prod`
- Make sure `NEXT_PUBLIC_API_URL` uses your EC2 public IP
- Check security group allows port 3001

### Problem: WebSocket connection fails

**Solution:**
- Check if WebSocket server is running: `sudo docker logs glyph-websockets`
- Verify security group allows port 8081
- Make sure `NEXT_PUBLIC_WS_URL` uses your EC2 public IP
- Check if WebSocket is listening: `sudo netstat -an | grep 8081`

### Problem: Database connection errors

**Solution:**
- Check if postgres is running: `sudo docker logs glyph-postgres`
- Verify `DATABASE_URL` in environment variables
- Check if migration ran: `sudo docker logs glyph-migrate`
- Try restarting postgres: `sudo docker restart glyph-postgres`

### Problem: Container keeps restarting

**Solution:**
```bash
# Check logs for error messages
sudo docker logs glyph-frontend

# Check if dependencies are healthy
sudo docker ps

# Verify environment variables
sudo docker exec glyph-frontend env | grep NEXT_PUBLIC
```

### Problem: Port already in use

**Solution:**
```bash
# Find process using port 3002
sudo lsof -i :3002

# Kill old containers
sudo docker stop $(sudo docker ps -aq)
sudo docker rm $(sudo docker ps -aq)

# Restart services
sudo docker-compose -f docker-compose.prod.yml up -d
```

---

## Production Recommendations

### 1. Use Domain Name (Optional but Recommended)

Instead of IP address, use a domain name:

**Setup DNS:**
1. Get a domain from Route 53, Namecheap, etc.
2. Create A record pointing to your EC2 IP
3. Update `.env.prod`:
   ```bash
   EC2_PUBLIC_IP=yourdomain.com
   NEXT_PUBLIC_API_URL=http://yourdomain.com:3001
   NEXT_PUBLIC_WS_URL=ws://yourdomain.com:8081
   ```

### 2. Enable HTTPS (Recommended)

Use Nginx with Let's Encrypt SSL:

```bash
# Install Nginx
sudo apt-get install nginx certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Configure Nginx to proxy to Docker services
# (See nginx-prod.config in repo)
```

### 3. Setup Automatic Backups

```bash
# Create backup script
cat > backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
sudo docker exec glyph-postgres pg_dump -U glyph_user glyph_board > backup_$DATE.sql
EOF

chmod +x backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup-db.sh
```

### 4. Monitor Resources

```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check Docker resource usage
sudo docker stats
```

### 5. Setup Log Rotation

Docker logs can grow large. Configure log rotation:

Edit `/etc/docker/daemon.json`:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Restart Docker:
```bash
sudo systemctl restart docker
```

---

## CI/CD Integration

Your GitHub Actions workflow automatically builds and pushes images to DockerHub.

**To deploy new changes:**

1. Push code to `main` branch
2. GitHub Actions builds and pushes to DockerHub
3. On EC2, pull and restart:
   ```bash
   cd ~/glyph-board
   sudo docker-compose -f docker-compose.prod.yml pull
   sudo docker-compose -f docker-compose.prod.yml up -d
   ```

**Automate updates with webhooks (advanced):**
- Setup GitHub webhook to trigger EC2 deployment
- Use AWS Lambda or a deployment script
- Automatically pull and restart on new pushes

---

## Cost Optimization

### Free Tier Eligible EC2 Instance
- **Type:** t2.micro (1 vCPU, 1 GB RAM)
- **Limitation:** May be slow with all 5 containers
- **Upgrade to:** t3.small or t3.medium for better performance

### Stop Instance When Not in Use
```bash
# From AWS Console or CLI
aws ec2 stop-instances --instance-ids i-1234567890abcdef0
```

### Use Elastic IP
- Prevents IP changes when stopping/starting instance
- First Elastic IP is free if instance is running

---

## Support

If you encounter issues:

1. Check logs: `sudo docker-compose logs -f`
2. Verify security groups and ports
3. Confirm environment variables are correct
4. Check GitHub Actions build logs
5. Review this troubleshooting guide

---

## Summary

You now have a production-ready Glyph Board deployment running on AWS EC2!

**Quick Reference:**
```bash
# Start services
sudo docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# View logs
sudo docker-compose -f docker-compose.prod.yml logs -f

# Stop services
sudo docker-compose -f docker-compose.prod.yml down

# Update services
sudo docker-compose -f docker-compose.prod.yml pull
sudo docker-compose -f docker-compose.prod.yml up -d

# Access application
http://YOUR_EC2_IP:3002
```

Happy collaborating! 🎨
