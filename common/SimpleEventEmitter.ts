export type Listener<T extends unknown[]> = (...args: T) => void

class SimpleEventEmitter<T extends unknown[]> {
  /**
   * Key: Listener
   * Value: Is it once?
   */
  private readonly listeners: Map<Listener<T>, boolean> = new Map()

  on (listener: Listener<T>, once = false): void {
    this.listeners.set(listener, once)
  }

  off (listener: Listener<T>): void {
    this.listeners.delete(listener)
  }

  emit (...args: T): void {
    this.listeners.forEach((once, listener) => {
      listener(...args)
      if (once) this.listeners.delete(listener)
    })
  }

  async once (): Promise<T> {
    return await new Promise(resolve => this.on((...args) => resolve(args), true))
  }
}

export default SimpleEventEmitter
