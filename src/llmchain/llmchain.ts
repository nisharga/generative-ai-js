import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { LLMChain } from "langchain/chains";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatBedrockConverse } from "@langchain/aws";

dotenv.config();

async function personalisedPitch(course: string, role: string, wordlimit: number) {
  const promptTemplate = new PromptTemplate({
    template: `Describe the importance of learning {course} for a {role}. Limit the output to {wordlimit} words.`,
    inputVariables: ["course", "role", "wordlimit"],
  });

  const formattedPrompt = await promptTemplate.format({
    course,
    role,
    wordlimit,
  });
  
  const llm = new OpenAI({
    // temperature: 0
    topP: 1,
    maxTokens: 50
  });

  /* const llm = new ChatAnthropic({
    model: "claude-3-5-sonnet-20240620",
    temperature: 0.7,
    maxTokens: 150,
  }); */

  /* const llm = new ChatBedrockConverse({
    model: "amazon.titan-text-lite-v1",
    maxTokens: 150,
    topP: 0.7,
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
    },
  }); */

  const outputParser = new StringOutputParser();

  // Option 1 - Langchain Legacy Chain
  /* const legacyLlmChain = new LLMChain({
    prompt: promptTemplate,
    llm,
    outputParser,
  });

  const answer = await legacyLlmChain.invoke({
    course,
    role,
    wordlimit,
  });

  console.log("Answer from legacy LLM chainsssssssssss: ", answer); */

  // Modern LCEL Chain
//   const lcelChain = promptTemplate.pipe(llm).pipe(outputParser);
  const lcelChain = RunnableSequence.from([
    promptTemplate,
    llm,
    outputParser
   ])

  const lcelResponse = await lcelChain.invoke({
    course,
    role,
    wordlimit,
  });

  console.log("Answer from LCEL chain RunnableSequence: ", lcelResponse);
}


await personalisedPitch("AWS", "Javascript Developer", 800);