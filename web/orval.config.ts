import { defineConfig } from "orval";

export default defineConfig({
  app: {
    input: {
      target:
        process.env.NODE_ENV === "production"
          ? "http://netpilot-server:4000/api/v1/api-docs-json"
          : "http://localhost:4000/api/v1/api-docs-json",
    },
    output: {
      target: "./src/api/openapi.ts",
      client: "react-query",
      mode: "tags-split",
      baseUrl:
        process.env.NODE_ENV === "production"
          ? "http://netpilot-server:4000"
          : "http://localhost:4000",
      override: {
        mutator: {
          path: "./src/api/mutator.ts",
          name: "customInstance",
        },
      },
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});
