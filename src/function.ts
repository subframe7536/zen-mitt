import type { Emitter } from './types'

/**
 * create event emitter
 * @param map external events map
 * @example
 * const events = mitt<{
 *   foo: [data: number]
 *   arr: [data: string[]]
 *   param: [name: string, age: number]
 * }>()
 * events.on('foo', console.log)
 * events.emit('foo', 1)
 *
 * events.on('arr', console.log)
 * events.emit('arr', ['test'])
 * events.off('arr')
 *
 * events.once('param', console.log)
 * events.emit('param', 'test', 1)
 *
 * events.off() // clear all listeners
 */

export const mitt = <Events extends Record<string, any[]>>(
  map: Map<keyof Events, Array<(...args: any[]) => void>> = new Map(),
): Emitter<Events> => ({
  on(event, handler) {
    map.get(event)?.push(handler) || map.set(event, [handler])
  },
  off(event?, handler?) {
    let handlers
    event
      ? handler
        ? (handlers = map.get(event)) && handlers.splice(handlers.indexOf(handler), 1)
        : map.set(event, [])
      : map.clear()
  },
  emit(event, ...data) {
    map.get(event)?.slice().map(handler => handler(...data))
  },
  once(event, handler) {
    let fn = (...args: any): any => {
      handler(...args)
      this.off(event, fn)
    }
    this.on(event, fn)
  },
})
