
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { codeGenerationAgent } from './agents/code-generation-agent';
import { universalCodeAgent } from './agents/universal-code-agent';
import { chainOfThoughtAgent } from './agents/chain-of-thought-agent';
import { treeOfThoughtsAgent } from './agents/tree-of-thoughts-agent';

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
    name: 'Mastra',
    level: 'info',
  }),
});
