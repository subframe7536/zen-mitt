import { describe, expect, it, mock } from 'bun:test'
import type { Emitter } from '../src/types'
import { mitt } from '../src/function'
import { Mitt } from '../src/class'

function testSuite(mode: string, getMitt: <E extends Record<string, any[]>>(map?: Map<string, any>) => Emitter<E>) {
  describe(`test ${mode}`, () => {
    it('should trigger multiple handlers', () => {
      const a = mock()
      const b = mock()
      const events = getMitt<{ foo: [] }>()
      events.on('foo', a)
      events.on('foo', b)
      events.emit('foo')
      expect(a).toBeCalledTimes(1)
      expect(b).toBeCalledTimes(1)
      events.off('foo', a)
      events.emit('foo')
      expect(a).toBeCalledTimes(1)
      expect(b).toBeCalledTimes(2)
    })
    it('should remove target listener after once() emitted', () => {
      const a = mock()
      const b = mock()
      const events = getMitt<{ foo: [] }>()
      events.once('foo', a)
      events.on('foo', b)
      events.emit('foo')
      expect(a).toBeCalledTimes(1)
      expect(b).toBeCalledTimes(1)
      events.emit('foo')
      expect(a).toBeCalledTimes(1)
      expect(b).toBeCalledTimes(2)
    })
    it('should remove all listeners after off() called', () => {
      const a = mock()
      const b = mock()
      const events = getMitt<{ foo: [], bar: [] }>()
      events.on('foo', a)
      events.on('bar', b)
      events.emit('foo')
      expect(a).toBeCalledTimes(1)
      events.emit('bar')
      expect(b).toBeCalledTimes(1)
      events.off()
      events.emit('foo')
      events.emit('bar')
      expect(a).toBeCalledTimes(1)
      expect(b).toBeCalledTimes(1)
    })
    it('should typesafe', () => {
      const foo = mock()
      const arr = mock()
      const param = mock()
      const events = getMitt<{
        foo: [data: number]
        arr: [data: string[]]
        param: [name: string, age: number]
      }>()
      events.on('foo', foo)
      events.emit('foo', 1)
      expect(foo).toBeCalledWith(1)
      events.on('arr', arr)
      events.emit('arr', ['test'])
      expect(arr).toBeCalledWith(['test'])
      events.on('param', param)
      events.emit('param', 'test', 1)
      expect(param).toBeCalledWith('test', 1)
    })
    it('should accept an optional event handler map', () => {
      const map = new Map()
      const a = mock()
      const b = mock()
      map.set('foo', [a, b])
      const events = getMitt<{ foo: [] }>(map)
      events.emit('foo')
      expect(a).toBeCalledTimes(1)
      expect(b).toBeCalledTimes(1)
    })
  })
}

testSuite('function', mitt)
testSuite('class', map => new Mitt(map) as Emitter<any>)

describe('test class extends', () => {
  class Test extends Mitt<any> {
    constructor() {
      super()
    }

    public test() {
      // @ts-expect-error err
      this.emit('test', 1)
    }
  }
  const t = new Test() as Emitter<{ test: [1] }> & Test
  it('should emit 1', () => {
    t.test()
    t.on('test', n => expect(n).toBe(1))
  })
})
