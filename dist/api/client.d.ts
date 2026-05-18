export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export interface RequestOptions {
    method: HttpMethod;
    path: string;
    body?: unknown;
    query?: Record<string, string | number | Array<string | number> | undefined>;
    extraHeaders?: Record<string, string>;
    /** Default true. Set false for endpoints that don't return `{code, message}` (e.g. /prediction/urlexamples). */
    expectErrorCode?: boolean;
}
export declare function request<T>(opts: RequestOptions, retry?: boolean): Promise<T>;
//# sourceMappingURL=client.d.ts.map