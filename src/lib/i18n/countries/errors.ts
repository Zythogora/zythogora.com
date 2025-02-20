export class UnknownCountryCodeError extends Error {
  constructor(code: string) {
    super(`Unknown country code: ${code}`);
  }
}
