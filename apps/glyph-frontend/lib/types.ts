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

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type SigninUser = z.infer<typeof SigninSchema>;

export interface AuthState {
    user: {
        id: string;
        email: string;
        name: string;
        photo?: string;
    } | null;
    isLoading: boolean;
    error: string | null;
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password';
    placeholder: string;
    required?: boolean;
}
