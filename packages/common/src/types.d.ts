import { z } from "zod";

declare const CreateUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    photo: z.ZodOptional<z.ZodString>;
}>;

declare const SigninSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}>;

declare const CreateRoomSchema: z.ZodObject<{
    name: z.ZodString;
}>;

export = {
    CreateUserSchema,
    SigninSchema,
    CreateRoomSchema,
    CreateUser: typeof CreateUserSchema,
    SigninUser: typeof SigninSchema,
    CreateRoom: typeof CreateRoomSchema
};
