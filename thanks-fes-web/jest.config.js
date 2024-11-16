require("jest-preset-angular/ngcc-jest-processor");

module.exports = {
  preset: "jest-preset-angular",
  rootDir: ".",
  setupFilesAfterEnv: ["<rootDir>/src/setup-jest.ts"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/e2e/"],
  transformIgnorePatterns: ["/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(ts|html)$": "jest-preset-angular",
    "^.+\\.js$": "babel-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "jsdom",
};
