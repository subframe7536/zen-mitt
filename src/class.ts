import { mitt } from './function'

export class Mitt<Event extends Record<string, any[]>> {
  /**
   * Class version of {@link mitt}
   */
  constructor(map?: Map<string, any>) {
    return Object.assign(this, mitt<Event>(map))
  }
}
