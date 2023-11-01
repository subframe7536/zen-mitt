## zen-mitt

light-weight(187B min+gzip) typesafe event emitter

```ts
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