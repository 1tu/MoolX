export type TDurationISO8601 = string;

export interface IObjectItem<V, K = string> {
  key: K;
  value: V;
}

export type TObject<C = any> = Record<string, any> & { context?: C };

export interface ISelectItem<V = any> {
  name: string;
  value: V;
}
