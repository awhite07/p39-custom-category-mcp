export const PEER39_ERROR_CODES: Readonly<Record<number, string>> = Object.freeze({
  0: 'Success',
  1: 'Failed to delete or create custom category',
  6: 'Account ID not found',
  10: 'Invalid category name (contains illegal characters)',
  13: 'URL is empty — a valid URL is required to create a custom URL category',
  16: 'Category is inactive',
  29: 'Keywords list is null or empty',
  31: 'Invalid Account ID',
  34: 'Invalid safeFrom value',
  38: 'Invalid language code',
  42: 'Category name is too long (max 120 chars)',
  44: 'Invalid keywords',
  47: 'Invalid type',
  49: 'Invalid URLs',
  50: 'Max field exceeded the maximum system limit (or below minimum, or invalid sort)',
  51: 'Invalid Buyer ID',
  58: 'Invalid email address',
  60: 'Invalid expiration date',
  62: 'Invalid expiration date',
  63: 'Invalid system parameter — the `system` header is wrong or missing',
});

export class Peer39ApiError extends Error {
  public readonly code: number;
  public readonly apiMessage: string;

  constructor(code: number, apiMessage: string, message?: string) {
    const human = PEER39_ERROR_CODES[code];
    super(message ?? `[code ${code}] ${human ?? apiMessage}`);
    this.name = 'Peer39ApiError';
    this.code = code;
    this.apiMessage = apiMessage;
  }
}

export class MissingConfigError extends Error {
  public readonly field: string;
  public readonly what: string;
  public readonly where: string;

  constructor(field: string, what: string, where: string) {
    super(
      `Missing configuration: ${what}.\n` +
      `Find it at: ${where}.\n` +
      `Once you have it, ask me to run \`peer39_configure\` with ${field}=<value> and I'll save it for next time.`,
    );
    this.name = 'MissingConfigError';
    this.field = field;
    this.what = what;
    this.where = where;
  }
}
