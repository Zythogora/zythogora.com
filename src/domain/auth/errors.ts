export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class SignUpError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = "SignUpError";
  }
}

export enum SignUpErrorType {
  USERNAME_ALREADY_EXISTS = "USERNAME_ALREADY_EXISTS",
  EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS",
  PASSWORD_TOO_SHORT = "PASSWORD_TOO_SHORT",
  PASSWORD_TOO_LONG = "PASSWORD_TOO_LONG",
  UNKNOWN_SIGN_UP_ERROR = "UNKNOWN_SIGN_UP_ERROR",
}

export class UsernameAlreadyExistsError extends SignUpError {
  constructor() {
    super(SignUpErrorType.USERNAME_ALREADY_EXISTS);
    this.name = "UsernameAlreadyExistsError";
  }
}

export class EmailAlreadyExistsError extends SignUpError {
  constructor() {
    super(SignUpErrorType.EMAIL_ALREADY_EXISTS);
    this.name = "EmailAlreadyExistsError";
  }
}

export class PasswordTooShortError extends SignUpError {
  constructor() {
    super(SignUpErrorType.PASSWORD_TOO_SHORT);
    this.name = "PasswordTooShortError";
  }
}

export class PasswordTooLongError extends SignUpError {
  constructor() {
    super(SignUpErrorType.PASSWORD_TOO_LONG);
    this.name = "PasswordTooLongError";
  }
}

export class UnknownSignUpError extends SignUpError {
  constructor() {
    super(SignUpErrorType.UNKNOWN_SIGN_UP_ERROR);
    this.name = "UnknownSignUpError";
  }
}

export enum UsernameErrorType {
  UNKNOWN_USERNAME_ERROR = "UNKNOWN_USERNAME_ERROR",
}

export class UsernameError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = "UsernameError";
  }
}

export class UnknownUsernameError extends UsernameError {
  constructor() {
    super(UsernameErrorType.UNKNOWN_USERNAME_ERROR);
    this.name = "UnknownUsernameError";
  }
}

export enum ResetPasswordErrorType {
  INVALID_TOKEN = "INVALID_TOKEN",
  UNKNOWN_RESET_PASSWORD_ERROR = "UNKNOWN_RESET_PASSWORD_ERROR",
}

export class ResetPasswordError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = "ResetPasswordError";
  }
}

export class InvalidTokenError extends ResetPasswordError {
  constructor() {
    super(ResetPasswordErrorType.INVALID_TOKEN);
    this.name = "InvalidTokenError";
  }
}

export class UnknownResetPasswordError extends ResetPasswordError {
  constructor() {
    super(ResetPasswordErrorType.UNKNOWN_RESET_PASSWORD_ERROR);
    this.name = "UnknownResetPasswordError";
  }
}
