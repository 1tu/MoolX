export type ISRouterScreen = string;

export enum ESRouterAction {
  Back,
  Navigate,
  Replace,
  Reset,
}

export interface ISRouterAction<S extends ISRouterScreen> {
  type: ESRouterAction;
  route: ISRouterNested<S>;
}

export interface ISRouterNested<S extends ISRouterScreen> {
  screen?: S;
  params?: ISRouterParams<S>;
}

export interface ISRouterParams<S extends ISRouterScreen> extends ISRouterNested<S> {
  [key: string]: any;
}

export interface ISRouterResetParams<S extends ISRouterScreen> extends ISRouterParams<S> {
  children?: ISRouterResetParams<S>;
}
