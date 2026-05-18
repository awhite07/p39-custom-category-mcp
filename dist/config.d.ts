import 'dotenv/config';
import { z } from 'zod';
declare const ConfigSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    buyerId: z.ZodOptional<z.ZodNumber>;
    system: z.ZodOptional<z.ZodString>;
    userEmail: z.ZodOptional<z.ZodString>;
    defaultPartnerId: z.ZodOptional<z.ZodNumber>;
    baseUrl: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
    baseUrl: string;
    buyerId?: number | undefined;
    system?: string | undefined;
    userEmail?: string | undefined;
    defaultPartnerId?: number | undefined;
}, {
    username: string;
    password: string;
    buyerId?: number | undefined;
    system?: string | undefined;
    userEmail?: string | undefined;
    defaultPartnerId?: number | undefined;
    baseUrl?: string | undefined;
}>;
export type Config = z.infer<typeof ConfigSchema>;
export declare const config: Readonly<Config>;
export declare const __ENV_VAR_NAMES: Record<("username" | "password" | "baseUrl") | ("buyerId" | "system" | "userEmail" | "defaultPartnerId"), string>;
export {};
//# sourceMappingURL=config.d.ts.map