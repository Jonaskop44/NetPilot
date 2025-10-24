import { defineConfig } from "orval";

export default defineConfig({
  app: {
    input: {
      target: "http://localhost:4000/api/v1/api-docs-json",
    },
    output: {
      target: "./src/api/openapi.ts",
      client: "react-query",
      mode: "tags-split",
      baseUrl: "http://localhost:4000",
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
