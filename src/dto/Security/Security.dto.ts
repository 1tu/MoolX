export interface IDSecurityCode {
  code: string;
}

export enum EDSecurityBy {
  CODE,
  BIO
}

export interface IDSecurityPayload {
  by: EDSecurityBy;
  text: string;
}

export enum EDSecurityBiometryType {
  Finger = 'TouchID',
  Face = 'FaceID',
}
