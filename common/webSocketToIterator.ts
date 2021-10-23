import { WebSocket as NodeWebSocket } from 'ws'
import ControllableAsyncIterator from './ControllableAsyncIterator'

const webSocketToIterator = (webSocket: WebSocket | NodeWebSocket): AsyncIterableIterator<Uint8Array> => {
  const iterator = new ControllableAsyncIterator<Uint8Array>()
  ;(webSocket as WebSocket).addEventListener('message', ({ data }) => {
    if (data instanceof Blob) {
      iterator.push((async () => new Uint8Array(await data.arrayBuffer()))())
    } else if (typeof data === 'string') {
      iterator.push(new TextEncoder().encode(data))
    } else if (data instanceof Uint8Array) {
      iterator.push(data)
    } else console.error('Cannot handle data', data)
  })
  return iterator
}

export default webSocketToIterator
