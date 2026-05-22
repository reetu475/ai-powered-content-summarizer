import 'dotenv/config';
import { Pinecone } from '@pinecone-database/pinecone';

async function test() {
  const envs = ['us-east1-gcp', 'us-east-1-aws', 'us-west1-gcp', 'us-east-1'];
  for (const env of envs) {
    try {
      console.log(`Trying environment: ${env}`);
      const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY || '',
        environment: env
      });
      
      const list = await pinecone.listIndexes();
      console.log(`SUCCESS with environment ${env}:`);
      console.log(JSON.stringify(list, null, 2));
      break;
    } catch (error) {
      console.error(`Failed with environment ${env}:`, error.message || error);
    }
  }
}

test();
