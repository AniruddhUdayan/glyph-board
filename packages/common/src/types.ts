import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6).max(20),
    name: z.string().min(2).max(20),
    photo: z.string().optional(),
});

export const SigninSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6).max(20),
});

export const CreateRoomSchema = z.object({
    name: z.string().min(2).max(20),
})