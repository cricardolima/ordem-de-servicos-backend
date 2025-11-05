import * as zod from "zod";

export const createClientSchema = zod.object({
    name: zod.string().min(1, { message: "Name is required" }),
    phone: zod.string().min(1, { message: "Phone is required" }),
    address: zod.array(zod.object({
        street: zod.string().min(1, { message: "Street is required" }),
        number: zod.string().min(1, { message: "Number is required" }),
        complement: zod.string().optional(),
        neighborhood: zod.string().min(1, { message: "Neighborhood is required" }),
        zipCode: zod.string().min(1, { message: "Zip code is required" }),
    })).optional(),
});