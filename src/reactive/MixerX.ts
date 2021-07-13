import { LambdaValue } from './LambdaX.reactive';

// @draft
export class MixerXBase<V0 extends object, V1 extends object, V2 extends object, V3 extends object, V4 extends object, V5 extends object> {
  public d = new Proxy<V0 & V1 & V2 & V3 & V4 & V5>(this.list.reduce((acc, i, index) => {
    acc[index] = i;
    return acc;
  }, {} as any), {
    // @ts-ignore
    get(
      target: { 0: V0, 1: V1, 2: V2, 3: V3, 4: V4, 5: V5 },
      key: keyof V0 & V1 & V2 & V3 & V4 & V5,
    ) {
      for (const k in target) {
        if ((target as any)[k][key]) return (target as any)[k][key];
      }
    },
  });

  constructor(public list: [V0, V1?, V2?, V3?, V4?, V5?]) {}
}

interface IPartCtor<DTO, V extends object> {
  new(dto: LambdaValue<DTO>): V;
}

export class MixerX<DTO extends object, V0 extends object, V1 extends object, V2 extends object, V3 extends object, V4 extends object, V5 extends object>
  extends MixerXBase<V0, V1, V2, V3, V4, V5> {
  public static Base = MixerXBase;

  constructor(
    dto: LambdaValue<DTO>,
    partList: [IPartCtor<DTO, V0>, IPartCtor<DTO, V1>?, IPartCtor<DTO, V2>?, IPartCtor<DTO, V3>?, IPartCtor<DTO, V4>?, IPartCtor<DTO, V5>?],
  ) {
    super(partList.map(p => new p!(dto)) as any);
  }
}
