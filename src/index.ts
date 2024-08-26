import type { ParseParameters } from '@subframe7536/type-utils'

type EventHandler<T> = (...data: ParseParameters<T>) => void
export type Emitter<Events extends Record<string, unknown>> = {
  /**
   * register an event handler for the given event.
   */
  on: <Event extends keyof Events>(event: Event, handler: EventHandler<Events[Event]>) => void
  /**
   * invoke all handlers for the given event.
   */
  emit: <Event extends keyof Events>(event: Event, ...data: ParseParameters<Events[Event]>) => void
  /**
   * invoke all handlers for the given event **once**.
   */
  once: <Event extends keyof Events>(event: Event, handler: EventHandler<Events[Event]>) => void
  /**
   * remove an event handler for the given event.
   * if `event` is omitted, all handlers will be removed.
   * if `handler` is omitted, all handlers of `event` will be removed.
   */
  off: <Event extends keyof Events>(event?: Event, handler?: EventHandler<Events[Event]>) => void
}

/**
 * create event emitter
 * @param map external events map
 * @example
 * const events = mitt<{
 *   foo: number
 *   arr: string[]
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
export const mitt = <Events extends Record<string, unknown>>(
  map: Map<keyof Events, EventHandler<any>[]> = new Map(),
): Emitter<Events> => ({
  on(event, handler) {
    map.get(event)?.push(handler) || map.set(event, [handler])
  },
  off(event?, handler?) {
    let handlers
    event
      ? handler
        ? (handlers = map.get(event)) && handlers.splice(handlers.indexOf(handler) >>> 0, 1)
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

export class Mitt<Events extends Record<string, unknown>> implements Emitter<Events> {
  /**
   * Class version of {@link mitt}
   */
  constructor(
    public map: Map<keyof Events, EventHandler<any>[]> = new Map(),
  ) { }

  on<Event extends keyof Events>(event: Event, handler: EventHandler<Events[Event]>): void {
    this.map.get(event)?.push(handler) || this.map.set(event, [handler])
  }

  off<Event extends keyof Events>(event?: Event, handler?: EventHandler<Events[Event]>): void {
    let handlers
    event
      ? handler
        ? (handlers = this.map.get(event)) && handlers.splice(handlers.indexOf(handler) >>> 0, 1)
        : this.map.set(event, [])
      : this.map.clear()
  }

  emit<Event extends keyof Events>(event: Event, ...data: ParseParameters<Events[Event]>): void {
    this.map.get(event)?.slice().map(handler => handler(...data))
  }

  once<Event extends keyof Events>(event: Event, handler: EventHandler<Events[Event]>): void {
    let fn = (...args: any): any => {
      handler(...args)
      this.off(event, fn)
    }
    this.on(event, fn)
  }
}
