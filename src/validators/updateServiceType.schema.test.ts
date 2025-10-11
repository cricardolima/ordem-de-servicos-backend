import { updateServiceTypeSchema } from "./updateServiceType.schema";

describe("UpdateServiceTypeSchema", () => {
    it("should validate the request body", () => {
        const requestBody = {
            serviceName: "Test Service",
            serviceCode: "TEST",
        }

        const result = updateServiceTypeSchema.safeParse(requestBody);
        expect(result.success).toBe(true);
        if(result.success) {
            expect(result.data).toEqual(requestBody);
        }
    });

    it("should throw a ValidationException if the request is invalid", () => {
        const requestBody = {}

        const result = updateServiceTypeSchema.safeParse(requestBody);
        expect(result.success).toBe(false);
        if(!result.success) {
            expect(result.error).toBeDefined();
            expect(result.error?.issues).toHaveLength(1);
            expect(result.error?.issues[0]?.message).toEqual("At least one field is required");
        }
    });
});