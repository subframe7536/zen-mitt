import { describe, expect, it, vi } from 'vitest'
import { type Emitter, Mitt, mitt } from '../src'

function test(mode: string, getMitt: <E extends Record<string, unknown>>(map?: Map<string, any>) => Emitter<E>) {
  describe(`test ${mode}`, () => {
    it('should trigger multiple handlers', () => {
      const a = vi.fn()
      const b = vi.fn()
      const events = getMitt<{ foo: undefined }>()
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
      const a = vi.fn()
      const b = vi.fn()
      const events = getMitt<{ foo: undefined }>()
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
      const a = vi.fn()
      const b = vi.fn()
      const events = getMitt<{ foo: null, bar: null }>()
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
      const foo = vi.fn()
      const arr = vi.fn()
      const param = vi.fn()
      const events = getMitt<{
        foo: number
        arr: string[]
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
      const a = vi.fn()
      const b = vi.fn()
      map.set('foo', [a, b])
      const events = getMitt<{ foo: undefined }>(map)
      events.emit('foo')
      expect(a).toBeCalledTimes(1)
      expect(b).toBeCalledTimes(1)
    })
  })
}

test('function', mitt)
test('class', map => new Mitt(map))
