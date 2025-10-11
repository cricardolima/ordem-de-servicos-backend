import * as zod from "zod";

export const updateServiceTypeSchema = zod.object({
    serviceName: zod.string().optional(),
    serviceCode: zod.string().optional(),
}).refine((data) => data.serviceName || data.serviceCode, {
    message: "At least one field is required",
});