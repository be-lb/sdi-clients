sdi-clients
===========

A collection of client-side applications.


## Overview

This code base is an attempt to provide an evolutive yet consistent collection of applications to interact with the corresponding SDI server. It's evolutive in that it's opened to new pieces and very much *in process* of converging to homogenous coding practices. We could not emphasize enough how much we seek to keep complexity as low as possible.

### basics

Language is Typescript in strict mode, and we try to stick to current release ---in order to minimize upgrade efforts.

Build system is Webpack and produces a bundle for each application.

Package management is npm. There are ```watch``` and ```build``` scripts to be invoked as follow
```bash
npm run watch <app_dir>
npm run build <app_dir> <...app_dir>
```

At the root of this repository is a ```manifest.json``` file which is used by the SDI server to auto-configure.

Each application folder is laidout the same, even though it's not a requirement. Here the ```login``` application as an example.

```bash
login/
├── src
│   ├── index.ts
│   ├── app.ts
│   ├── components
│   │   ├── login
│   │   │   └── index.ts
│   │   └── logout
│   │       └── index.ts
│   ├── events
│   │   ├── app.ts
│   │   └── login.ts
│   ├── queries
│   │   ├── app.ts
│   │   └── login.ts
│   ├── remote
│   │   └── index.ts
│   └── shape
│       └── index.ts
├── style
│   ├── index.js
│   └── less
│       ├── styles.less
│       └── widgets
│           └── login.less
├── tsconfig.json
└── webpack.config.js

```

At the root of it we've got ```tsconfig.json``` and ```webpack.config.js``` which mostly inherit from their base config. ```style``` holds overrides and specific styles for this application. Then comes the main part in ```src``` where you'll find the actual code for the application.
An exception to this is the ```sdi``` folder which is where shared pieces are supposed to end up ---models, input components, utilities, network wrappers, etc. A bit of tsconfig/webpack magic powder makes those modules available under ```sdi/``` in your code, e.g.:

```typescript
import { DIV } from 'sdi/components/elements';
import { MessageRecord, IMapInfo } from 'sdi/source';
```
### bandwagon & FP

At the application level, the design is widely inspired by [re-frame](https://github.com/Day8/re-frame/) framework, and further picks up what has been thought to be good parts of functional programming, leveraging [fp-ts](https://github.com/gcanti/fp-ts) and its ecosytem. We use React as a virtual-dom implementation, but you can see reading the code that we almost strictly use it with render functions, meaning it's not of extreme importance.

So re-frame in brief: 
  - Application state is held in one place
  - Application state is altered by events
  - Application state is queried like a database
  - View is the result of a function applied to application state
  - Dom manipulation is a side effect managed by the vdom implementation


## Typing

### shape

It starts with the application state, referred as a shape (```IShape```), and relevant functions found in ```sdi/shape```. There's a base shape mainly used by the base application to bootstrap your own application.
The way to add keys to the application state is by means of [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html). 

Coming back to the ```login``` example, it's why we've got a ```shape``` folder
```bash
login/
├── src
(...)
│   └── shape
│       └── index.ts
(...)
```

where we can find the following construct to extend application state typings.

```typescript
declare module 'sdi/shape' {
    export interface IShape {
        'app/layout': AppLayout[];

        'component/button': ButtonComponent;
        'component/table/alias': IDataTable;
        'component/form': FormAlias;

        'data/user': IUser | null;
    }
}
```

```sdi/shape``` exports mainly two functions to interact with application state, ```dispatch``` and ```query```. These functions should be used only in an application under ```queries``` and ```events``` directories, it helps drawing boundaries.

```dispatch(key, reducer)``` produces a new state. It takes two arguments, a key from the application state and a function that takes the value for this key and returns a new value for this key, e.g.

```ts
export const loadUser =
    (url: string) =>
        fetchUser(url)
            .then((user) => {
                dispatch('data/user', () => user);
            });
```


```query(key)``` is quite the opposite and retrieves a value for a key in the application state. Note that the value returned by ```query``` is made immutable through a ```Proxy``` and it's then well advised to not feed back the application state with it.

```ts
export const getMetadataId =
    () => query('app/current-metadata');
```

As a convenience, both ```dispatch``` and ```query``` come in pre-keyed flavors, ```dispatchK``` and ```queryK```.

### source

Another large part of typings is made of data structures which are moving back and forth between your application and the SDI server. Those are defined in ```sdi/source/io``` alongside functions to fetch data from the server and push it back. These types are built with [io-ts](https://github.com/gcanti/io-ts/) in order to provide runtime type checking at API boundaries.

Example from ```sdi/source/io/alias.ts```
```ts
import { MessageRecordIO } from './io';
import * as io from 'io-ts';

export const IAliasIO = io.interface({
    id: io.number,
    select: io.string,
    replace: MessageRecordIO,
}, 'IAliasIO');
export type IAlias = io.TypeOf<typeof IAliasIO>;
```

```sdi/source``` also holds functions to communicate with the SDI server: ```fetchIO```, ```postIO```, ```deleteIO```. Typical use involves specializing these functions in a ```remote``` module in your application and call these with API URL retrieved from the base application, e.g.:

In view/src/remote/index.ts
```ts
export const fetchMap =
    (url: string): Promise<IMapInfo> => fetchIO(IMapInfoIO, url);
```

Where ```IMapInfoIO``` is an ```io.Type<IMapInfo>``` that will be validated before being returned as a regular ```IMapInfo```.

And in view/src/events/app.ts
```ts
import { getApiUrl } from 'sdi/app';

export const loadMapEvent =
    () => fromNullable(queries.getCurrentMap())
        .map(
            mid => fetchMap(getApiUrl(`maps/${mid}`))
                      .then(info => loadMap(info))
        );
    
```


### component

Typings that are specific to a component should be put in the index of it, such as making it possible to import them cleanly. 

```ts
// from sdi
import { getApiUrl } from 'sdi/app';

// from within an app
import { MyInterface } from './components/name';
```

### finally

The idea behind putting types on top of this document is that following them along should help one picture some kind of architecture, an intent. Because some patterns emerged when writing this code which did not propagate to every corners of the codebase, we believe that the expression of this intent is better suited to guide further developments.





