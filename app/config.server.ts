import { z } from 'zod';

const envSchema = z.object({
  SOLANA_NETWORK: z.string().default('devnet'),
  SOLANA_RPC_URL: z.string(),
  MARKETPLACE_PROGRAM_ID: z.string(),
  MARKETPLACE_AUTHORITY_PUBLIC_KEY: z.string(),
});

export const config = envSchema.parse(process.env);
