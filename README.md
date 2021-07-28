# MoolX
MobX tools for effective lazy reactive one way stream (support 3-layer architect)

## Dictionary.
`Layer` = a subset of the entire set of components (classes, functions, variables) divided into categories:
- `System` (prefix `S`) = implementation of the data source from the outside. Has access to the device. Knows about the methods of data transfer and storage.
- `Domain` (prefix `D`) = implementation of a business idea using program code.
- `View` (prefix `V`) = implementation of the interface for the data consumer, i.e. the User. How the user WILL SEE the data. Data transfer (input data by EVENT) from the User to the server.
`DTO` = an object containing ONLY properties. It comes from the System Layer.

## The flow of changes.
It can be divided into 2 parts:
- `EVENT` distribution flow (VIEW > DOMAIN > SYSTEM)
- `DATA` distribution flow (SYSTEM > DOMAIN > VIEW)

## DATA flow
To create a `data stream`, you need components from the "reactive" folder:

0) `LambdaX` - is a way to make a "reactive bridge" for transferring data from one place to another (an alternative to `@computed`, where it is not convenient to use it).
1) `AsynX` - is the source of asynchronous data (most often it is data from the server / hardware API). It extracts data from the outside (server, device) as is (`DTO`).
2) `ModelX` - is the basis for reactive models, it is needed to expand the `DTO` functionality. Adds new properties (`@observable`), properties calculated from the DTO (`@computed`), methods (`@action`) to work in the context of this model.
3) `MapX` - is a mutator that is needed for more productive transformation/updating of pure data from the source (`DTO`) into `models`.

4) `EventX` - sometimes it is necessary that the data flow is discrete. For example, we need errors to pop up in layers in turn, so that we can process each one separately. In fact, this is just an EventEmitter.

## Expample
use IoC for instantiate classes. 

### system layer
```
// S.User.transport.ts
class SUserTransport {
  ...
  public async self(request: ISUserSelfRequest): Promise<ISUserSelfResponse> {
    return fetch(`/user/self`, request);
  }
  ...
  // IResponse = { code: 0 = OK, message?, data }
}
```

```
// S.User.adapter.ts
class SUserAdapter implements IDUserAdapter {
  ...
  public self(request: IDUserSelfRequestDTO): Promise<IDUserSelfResponseDTO> {
    return this._transport.self(request /* here we can adapt request */).then(res => res /* here we can adapt response */);
  }
  ...
}
```

### domain layer
```
// D.UserSelf.model.ts
class DUserSelfModel extends ModelX<IDUserSelfResponseDTO> {
  @computed
  public get nameFull() {
    return `${this.dto.nameFirst} ${this.dto.nameLast}`
  }
  
  @computed
  public get birthday() {
    return new Date(this.dto.birthday);
  }
}
```

```
// D.User.gateway.ts
class DUserGateway {
  ...
  public self(opts: IAsynXOpts<IDUserAdapter['self']>) {
    const source = new AsynX(this._adapter.self.bind(this._adapter), opts);
    return new MapX(source, () => source.data?.data, lv => new DUserSelfModel(lv));
  }
  ...
}
```

```
// D.User.store.ts
class DUserStore {
  ...
  public selfX = this._gateway.self({
    name: 'DUserStore.selfX', req: () => this._authStore.authenticated /* <- reactive property */ ? {} : undefined,
  });
  ...
}
```

```
// D.UserSelf.case.ts
class DUserSelfCase {
  ...
  @computed 
  public get selfX() {
    return this._store.selfX;
  }
  ...
}
```

### view layer (platform independent)
```
// V.UserSelf.model.ts
class VUserSelfModel extends VModelX<DUserSelfModel> {
  @computed
  public get nameFull() {
    return `your full name - ${this.domain.nameFull}`
  }
  
  @computed
  public get birthday() {
    return `your birthday - ${Formatter.date(this.domain.birthday)}`;
  }
}
```

```
// V.UserSelf.present.ts
class VUserSelfPresent {
  ...
  public selfX = new MapX.View(this._case.selfX.source,
    () => this._case.selfX.model, (m) => new VUserSelfModel(m));
  ...
  // in View model we can format / localize / etc.
}
```

we need react / react-native / angular / vue depenedency ONLY in this level
#### view MOBILE layer
```
// V.UserSelf.screen.ts
@observer
class VUserSelfScreen extends React.component<...> {
  ...
  public render() {
    const { name, birthday /* formatted & localized */ } = this._present.selfX.model;
    const { isLoading, isEmpty, error } = this._present.selfX.source /* this is AsynX instance */;
    
    if (isLoading) ...
    if (isEmpty) ...
    if (error) ...
    // or just make a component that will handle the source states
    
    return (
      <View>
        <Text>{name}</Text>
        <Text>{birthday}</Text>
      </View>
    );
  }
  ...
}
```

#### view WEB layer
```
// V.UserSelf.screen.ts
@observer
class VUserSelfScreen extends React.component<...> {
  ...
  public render() {
    const { name, birthday /* formatted & localized */ } = this._present.selfX.model;

    return (
      // handle isLoading / isEmpty / isError
      <VStub mapXList={[this._present.selfX]}>{() => (
        <div>
          <h1>{name}</h1>
          <span>{birthday}</span>
        </div>
      )}<VStub>
    );
  }
  ...
}
```

## Profit 
(!) There is no need to pull the request for obtaining user data with your hands (write `~ api.getUser().then(...).catch(...)`) (!). 
At the moment when the data is needed in the VIEW layer (inside MobX autorun), they will start loading themselves.

Thus, we get a continuous data stream, which we don't need to worry about, think about synchronizing its state (we just call `AsynX.refresh`, or it will update itself when the `req` object\lambdaValue passed to `AsynX` changes)
