import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(20, { message: "Password must be less than 20 characters" }),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(20, { message: "Name must be less than 20 characters" }),
    photo: z.string().optional(),
});

export const SigninSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(20, { message: "Password must be less than 20 characters" }),
});

export const CreateRoomSchema = z.object({
    name: z.string().min(2, { message: "Room name must be at least 2 characters" }).max(20, { message: "Room name must be less than 20 characters" }),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type SigninUser = z.infer<typeof SigninSchema>;
export type CreateRoom = z.infer<typeof CreateRoomSchema>;
