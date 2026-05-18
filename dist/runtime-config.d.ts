import { z } from 'zod';
export declare const RuntimeConfigSchema: z.ZodObject<{
    buyerId: z.ZodOptional<z.ZodNumber>;
    system: z.ZodOptional<z.ZodString>;
    userEmail: z.ZodOptional<z.ZodString>;
    defaultPartnerId: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    buyerId?: number | undefined;
    system?: string | undefined;
    userEmail?: string | undefined;
    defaultPartnerId?: number | undefined;
}, {
    buyerId?: number | undefined;
    system?: string | undefined;
    userEmail?: string | undefined;
    defaultPartnerId?: number | undefined;
}>;
export type RuntimeConfig = z.infer<typeof RuntimeConfigSchema>;
export declare function readRuntimeConfig(): Promise<RuntimeConfig>;
export declare function updateRuntimeConfig(patch: Partial<RuntimeConfig>): Promise<RuntimeConfig>;
export declare function _resetCacheForTests(): void;
export declare function _runtimeConfigPathsForTests(): {
    dir: string;
    file: string;
};
//# sourceMappingURL=runtime-config.d.ts.map