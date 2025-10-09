import * as zod from "zod";

export const createServiceTypeSchema = zod.object({
    serviceName: zod.string().min(1, { message: "Service name is required" }),
    serviceCode: zod.string().min(1, { message: "Service code is required" }),
});