import * as z from "zod";
import { Role } from "@prisma/client";


export const updateUserSchema = z.object({
    name: z.string().optional(),
    registration: z.string().optional(),
    password: z.string().optional(),
    role: z.enum(Role, { message: "Role is required" }).optional(),
});