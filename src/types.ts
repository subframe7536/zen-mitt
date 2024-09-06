export type Emitter<Events extends Record<string, any[]>> = {
  /**
   * register an event handler for the given event.
   */
  on: <E extends keyof Events>(event: E, handler: (...data: Events[E]) => void) => void
  /**
   * invoke all handlers for the given event.
   */
  emit: <E extends keyof Events>(event: E, ...data: Events[E]) => void
  /**
   * invoke all handlers for the given event **once**.
   */
  once: <E extends keyof Events>(event: E, handler: (...data: Events[E]) => void) => void
  /**
   * remove an event handler for the given event.
   * if `event` is omitted, all handlers will be removed.
   * if `handler` is omitted, all handlers of `event` will be removed.
   */
  off: <E extends keyof Events>(event?: E, handler?: (...data: Events[E]) => void) => void
}
