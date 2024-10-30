import 'dotenv/config';
import { z } from "zod";

const mySchema = z.object({
    PORT: z.coerce.number(),
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number(),
    DB_USERNAME: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    JWT_SECRET: z.string()
})

export const env = mySchema.parse(process.env);