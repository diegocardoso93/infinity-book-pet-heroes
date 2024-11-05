import OpenAI from "openai";

export function buildOpenAIClient(env: Env) {
  return new OpenAI({
    organization: env.OPENAI_ORGANIZATION,
    project: env.OPENAI_PROJECT,
    apiKey: env.OPENAI_APIKEY,
  });
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
