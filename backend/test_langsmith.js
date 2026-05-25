import 'dotenv/config';
import { generateAllSummaries } from './src/services/openaiService.js';

async function verify() {
  try {
    console.log("Testing LangSmith integration...");
    console.log("Using API Key:", process.env.LANGSMITH_API_KEY ? "Present (Starts with " + process.env.LANGSMITH_API_KEY.slice(0, 10) + ")" : "Missing");
    console.log("Using Project:", process.env.LANGSMITH_PROJECT);
    
    const text = "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.";
    
    console.log("Calling generateAllSummaries...");
    const result = await generateAllSummaries(text, 'text');
    console.log("Success! Summaries generated:");
    console.log(JSON.stringify(result, null, 2));
    
    console.log("Waiting a few seconds for LangSmith traces to flush...");
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log("Done. Please check your LangSmith project dashboard at https://smith.langchain.com/ to confirm the traces are appearing.");
  } catch (err) {
    console.error("Verification failed:", err);
  }
}

verify();
