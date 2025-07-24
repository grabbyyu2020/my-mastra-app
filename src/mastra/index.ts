import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { weatherWorkflow } from "./workflows/weather-workflow";
import { weatherAgent } from "./agents/weather-agent";
import { codeGenerationAgent } from "./agents/code-generation-agent";
import { universalCodeAgent } from "./agents/universal-code-agent";
import { chainOfThoughtAgent } from "./agents/chain-of-thought-agent";
import { treeOfThoughtsAgent } from "./agents/tree-of-thoughts-agent";
import { registerCopilotKit } from "@ag-ui/mastra";

type WeatherRuntimeContext = {
  "user-id": string;
  "temperature-scale": "celsius" | "fahrenheit";
};

export const mastra = new Mastra({
  // workflows: { weatherWorkflow },
  agents: {
    weatherAgent,
    codeGenerationAgent,
    universalCodeAgent,
    chainOfThoughtAgent,
    treeOfThoughtsAgent,
  },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  server: {
    cors: {
      origin: "*",
      allowMethods: ["*"],
      allowHeaders: ["*"],
    },
    apiRoutes: [
      registerCopilotKit<WeatherRuntimeContext>({
        path: "/copilotkit",
        resourceId: "weatherAgent",
        setContext: (c, runtimeContext) => {
          runtimeContext.set(
            "user-id",
            c.req.header("X-User-ID") || "anonymous"
          );
          runtimeContext.set("temperature-scale", "celsius");
        },
      }),
    ],
  },
});
