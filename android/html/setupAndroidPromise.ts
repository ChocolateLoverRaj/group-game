import SimpleEventEmitter from '../../common/SimpleEventEmitter'

export interface AndroidPromise<T> extends Promise<T> {
  thenId: number
  catchId: number
}

// eslint-disable-next-line @typescript-eslint/promise-function-async
const setupAndroidPromise = <T extends unknown[]>(): AndroidPromise<T> => {
  const thenId = Math.random()
  const catchId = Math.random()
  const thenEmitter = new SimpleEventEmitter<T>()
  const catchEmitter = new SimpleEventEmitter<[string]>()

  const thenPromise = thenEmitter.once()
  const catchPromise = catchEmitter.once()

  androidCallbacks.set(thenId, thenEmitter)
  androidCallbacks.set(catchId, catchEmitter)

  enum ResultType { RESOLVED, REJECTED }
  const promise: Promise<T> = Promise.race([
    thenPromise.then(v => [ResultType.RESOLVED, v]),
    catchPromise.then(e => [ResultType.REJECTED, e])])
    .then(([type, value]) => {
      if (type === ResultType.REJECTED) throw new Error((value as [string])[0])
      return value
    })
    .finally(() => {
      androidCallbacks.delete(thenId)
      androidCallbacks.delete(catchId)
    }) as any

  const androidPromise: AndroidPromise<T> = Object.assign(promise, {
    thenId, catchId
  })

  return androidPromise
}

export default setupAndroidPromise
