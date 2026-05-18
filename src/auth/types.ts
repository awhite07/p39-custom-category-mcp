export interface LoginResponse {
  result: { sessionId: string };
  expirationInSeconds: number;
}

export interface CachedToken {
  sessionId: string;
  expiresAt: number;
}
