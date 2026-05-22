import 'dotenv/config';
import { Pinecone } from '@pinecone-database/pinecone';

async function run() {
  try {
    const environment = 'us-east1-gcp';
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || '',
      environment: environment
    });

    console.log('Creating serverless index "ai-summarizer"...');
    await pinecone.createIndex({
      name: 'ai-summarizer',
      dimension: 1536,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      }
    });
    console.log('Index created successfully!');
  } catch (error) {
    console.error('Error creating index:', error);
  }
}

run();
