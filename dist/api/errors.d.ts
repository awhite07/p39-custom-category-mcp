export declare const PEER39_ERROR_CODES: Readonly<Record<number, string>>;
export declare class Peer39ApiError extends Error {
    readonly code: number;
    readonly apiMessage: string;
    constructor(code: number, apiMessage: string, message?: string);
}
export declare class MissingConfigError extends Error {
    readonly field: string;
    readonly what: string;
    readonly where: string;
    constructor(field: string, what: string, where: string);
}
//# sourceMappingURL=errors.d.ts.map