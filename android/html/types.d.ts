import SimpleEventEmitter from '../../common/SimpleEventEmitter'

declare global {
  const androidCallbacks: Map<number, SimpleEventEmitter<any>>

  namespace Android {
    const canJoinTcp: () => string
    const joinTcp: (thenCb: number, catchCb: number, host: string, port: number) => void
    const socketWrite: (thenCb: number, catchCb: number, data: Uint8Array) => void
    const socketRead: (thenCb: number, catchCb: number) => void
    const socketClose: (thenCb: number, catchCb: number) => void
  }
}
