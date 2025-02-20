export class AuthError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class SignInError extends AuthError {
  constructor(message: string) {
    super(message);
  }
}

export enum SignInErrorType {
  CREDENTIALS_INVALID = "CREDENTIALS_INVALID",
  EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",
  UNKNOWN_SIGN_IN_ERROR = "UNKNOWN_SIGN_IN_ERROR",
}

export class CredentialsInvalidError extends SignInError {
  constructor() {
    super(SignInErrorType.CREDENTIALS_INVALID);
  }
}

export class EmailNotVerifiedError extends SignInError {
  constructor() {
    super(SignInErrorType.EMAIL_NOT_VERIFIED);
  }
}

export class UnknownSignInError extends SignInError {
  constructor() {
    super(SignInErrorType.UNKNOWN_SIGN_IN_ERROR);
  }
}

export class SignUpError extends AuthError {
  constructor(message: string) {
    super(message);
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
  }
}

export class EmailAlreadyExistsError extends SignUpError {
  constructor() {
    super(SignUpErrorType.EMAIL_ALREADY_EXISTS);
  }
}

export class PasswordTooShortError extends SignUpError {
  constructor() {
    super(SignUpErrorType.PASSWORD_TOO_SHORT);
  }
}

export class PasswordTooLongError extends SignUpError {
  constructor() {
    super(SignUpErrorType.PASSWORD_TOO_LONG);
  }
}

export class UnknownSignUpError extends SignUpError {
  constructor() {
    super(SignUpErrorType.UNKNOWN_SIGN_UP_ERROR);
  }
}
