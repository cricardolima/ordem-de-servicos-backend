import { refreshTokenSchema } from "./refreshToken.schema";

describe("RefreshTokenSchema", () => {
    it("should validate the request body", () => {
        const requestBody = {
            refreshToken: "1234567890"
        }

        const result = refreshTokenSchema.safeParse(requestBody);
        expect(result.success).toBe(true);
        if(result.success) {
            expect(result.data).toEqual(requestBody);
        }
    });

    it("should throw a ValidationException if the request is invalid", () => {
        const requestBody = {
            refreshToken: ""
        }

        const result = refreshTokenSchema.safeParse(requestBody);
        expect(result.success).toBe(false);
        if(!result.success) {
            expect(result.error).toBeDefined();
            expect(result.error?.issues).toHaveLength(1);
            expect(result.error?.issues[0]?.path).toEqual(["refreshToken"]);
            expect(result.error?.issues[0]?.message).toEqual("Refresh token is required");
        }
    });

    it("should throw a ValidationException if the request is invalid", () => {
        const requestBody = {
            refreshToken: ""
        }

        const result = refreshTokenSchema.safeParse(requestBody);
        expect(result.success).toBe(false);
        if(!result.success) {
            expect(result.error).toBeDefined();
            expect(result.error?.issues).toHaveLength(1);
            expect(result.error?.issues[0]?.path).toEqual(["refreshToken"]);
            expect(result.error?.issues[0]?.message).toEqual("Refresh token is required");
        }
    });
});