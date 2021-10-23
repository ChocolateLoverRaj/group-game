import SimpleEventEmitter from './SimpleEventEmitter'

class ControllableAsyncIterator<T> extends SimpleEventEmitter<[]> implements AsyncIterableIterator<T> {
  private readonly upcoming: Array<(T | PromiseLike<T>)> = []
  private done = false;

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  [Symbol.asyncIterator] () {
    return this
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async next () {
    if (!this.done && this.upcoming.length === 0) await this.once()
    return this.done
      ? { done: true as true, value: undefined }
      : {
          value: await (this.upcoming.shift() as T | PromiseLike<T>)
        }
  }

  push (value: T | PromiseLike<T>): void {
    this.upcoming.push(value)
    this.emit()
  }

  end (): void {
    this.done = true
    this.emit()
  }
}

export default ControllableAsyncIterator
