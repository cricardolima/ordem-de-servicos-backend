const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "@container/(.*)": "<rootDir>/src/container/$1",
    "@use-cases/(.*)": "<rootDir>/src/use-cases/$1",
    "@repositories/(.*)": "<rootDir>/src/repositories/$1",
    "@utils/(.*)": "<rootDir>/src/utils/$1",
    "@dtos/(.*)": "<rootDir>/src/dtos/$1",
    "@controllers/(.*)": "<rootDir>/src/controllers/$1",
    "@exceptions/(.*)": "<rootDir>/src/exceptions/$1",
    "@middleware/(.*)": "<rootDir>/src/middleware/$1",
    "@validators/(.*)": "<rootDir>/src/validators/$1",
  },
};