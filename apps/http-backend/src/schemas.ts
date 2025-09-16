const { z } = require("zod");

const CreateUserSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(20, { message: "Password must be less than 20 characters" }),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(20, { message: "Name must be less than 20 characters" }),
    photo: z.string().optional(),
});

const SigninSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(20, { message: "Password must be less than 20 characters" }),
});

const CreateRoomSchema = z.object({
    name: z.string().min(2, { message: "Room name must be at least 2 characters" }).max(20, { message: "Room name must be less than 20 characters" }),
});

module.exports = {
    CreateUserSchema,
    SigninSchema,
    CreateRoomSchema
};
