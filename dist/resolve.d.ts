export type Resolvable = 'buyerId' | 'system' | 'userEmail' | 'defaultPartnerId';
interface ResolvedTypeMap {
    buyerId: number;
    system: string;
    userEmail: string;
    defaultPartnerId: number;
}
export declare function resolve<K extends Resolvable>(key: K, override?: unknown): Promise<ResolvedTypeMap[K]>;
export declare function tryResolve<K extends Resolvable>(key: K, override?: unknown): Promise<ResolvedTypeMap[K] | undefined>;
export {};
//# sourceMappingURL=resolve.d.ts.map