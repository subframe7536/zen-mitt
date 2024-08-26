# zen-mitt

light-weight(187B min+gzip) typesafe event emitter

## Install

```sh
npm install zen-mitt
```
```sh
yarn add zen-mitt
```
```sh
pnpm add zen-mitt
```

## Usage

```ts
import { mitt } from 'zen-mitt'

const events = mitt<{
  foo: number
  arr: string[]
  param: [name: string, age?: number]
}>()
events.on('foo', console.log)
events.emit('foo', 1)

events.on('arr', console.log)
events.emit('arr', ['test'])
events.off('arr')

events.once('param', console.log)
events.emit('param', 'test', 1)

events.off() // clear all listeners
```

### Class version

```ts
import { Mitt } from 'zen-mitt'

const events = new Mitt()
```

## License

MIT
