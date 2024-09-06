import { readFileSync, writeFileSync } from 'node:fs'

function patch(path) {
  const code = readFileSync(path, 'utf-8')
  writeFileSync(path, code.replace(
    `declare class Mitt<Event extends Record<string, any[]>> {
    /**
     * Class version of {@link mitt}
     */
    constructor(map?: Map<string, any>);
}`,
    `declare class Mitt<Events extends Record<string, any[]>> {
    /**
     * Class version of {@link mitt}
     */
    constructor(map?: Map<keyof Events, Array<(...args: any[]) => void>>);
    /**
     * register an event handler for the given event.
     */
    on: <E extends keyof Events>(event: E, handler: (...data: Events[E]) => void) => void;
    /**
     * invoke all handlers for the given event.
     */
    emit: <E extends keyof Events>(event: E, ...data: Events[E]) => void;
    /**
     * invoke all handlers for the given event **once**.
     */
    once: <E extends keyof Events>(event: E, handler: (...data: Events[E]) => void) => void;
    /**
     * remove an event handler for the given event.
     * if \`event\` is omitted, all handlers will be removed.
     * if \`handler\` is omitted, all handlers of \`event\` will be removed.
     */
    off: <E extends keyof Events>(event?: E, handler?: (...data: Events[E]) => void) => void;
}`,
  ))
  console.log('patch', path)
}

patch('./dist/class.d.ts')
patch('./dist/class.d.cts')
