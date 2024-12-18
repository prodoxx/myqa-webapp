import { z } from 'zod';

const envSchema = z.object({
  VITE_SOLANA_NETWORK: z.string().default('devnet'),
  VITE_SOLANA_RPC_URL: z.string(),
  VITE_MARKETPLACE_PROGRAM_ID: z.string(),
  VITE_MARKETPLACE_AUTHORITY_PUBLIC_KEY: z.string(),
});

export const config = envSchema.parse(import.meta.env);
