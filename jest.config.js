const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  moduleNameMapper: {
    "@container/(.*)": "<rootDir>/src/container/$1",
    "@use-cases/(.*)": "<rootDir>/src/use-cases/$1",
    "@repositories/(.*)": "<rootDir>/src/respositories/$1",
    "@utils/(.*)": "<rootDir>/src/utils/$1",
    "@dtos/(.*)": "<rootDir>/src/dtos/$1",
    "@controllers/(.*)": "<rootDir>/src/controllers/$1",
    "@exceptions/(.*)": "<rootDir>/src/exceptions/$1",
    "@middleware/(.*)": "<rootDir>/src/middlewares/$1",
    "@validators/(.*)": "<rootDir>/src/validators/$1",
    "@tests/(.*)": "<rootDir>/tests/$1",
    "@lib/(.*)": "<rootDir>/src/lib/$1",
  },
};