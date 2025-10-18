import * as zod from "zod";

export const createProfessionalSchema = zod.object({
    name: zod.string().min(1, { message: "Name is required" }),
    registration: zod.string().min(1, { message: "Registration is required" }),
});