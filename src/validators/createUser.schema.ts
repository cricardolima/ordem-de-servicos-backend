import * as zod from "zod";
import { Role } from "@prisma/client";

export const createUserSchema = zod.object({
    name: zod.string().min(1, { message: "Name is required" }),
    registration: zod.string().min(1, { message: "Registration is required" }),
    password: zod.string().min(1, { message: "Password is required" }).min(8, { message: "Password must be at least 8 characters long" }),
    role: zod.enum(Role, { message: "Role is required" }),
});