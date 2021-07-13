export enum EDAuthForgotFactor {
  Login,
  Phone,
}

export enum EDAuthPasswordType {
  Temporary = 0,
  Permanent = 1,
}

export enum EDAuthPasswordStatus {
  Expired = 0,
  Valid = 1,
}

export enum EDAuthPasswordHash {
  UNKNOWN = 0,
  MD5 = 1,
  SHA512 = 2,
  HMACSHA512 = 3,
}

export interface IDAuthSession {
  accessToken: string;
  refreshToken?: string;
}

export interface IDAuthCred {
  login: string;
  password: string;
}

export interface IDAuthPasswordChange {
  oldPassword: string;
  newPassword: string;
}

export interface IDAuthPasswordSet {
  oldPassword: string;
  password: string;
  passwordConfirm: string;
}

export enum EDAuthStrategy {
  TokenRefresh,
  Cred
}
