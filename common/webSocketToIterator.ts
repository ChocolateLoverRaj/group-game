import toAsyncIterator from 'callback-to-async-iterator'

const webSocketToIterator = (webSocket: WebSocket): AsyncIterableIterator<Uint8Array> => {
  let listener: (e: MessageEvent) => void
  // eslint-disable-next-line promise/param-names
  return toAsyncIterator<Uint8Array>(async callback => await new Promise((_resolve, reject) => {
    listener = e => {
      if (e.data instanceof Blob) {
        (async () => new Uint8Array(await e.data.arrayBuffer()))().then(callback, reject)
      } else if (typeof e.data === 'string') {
        callback(new TextEncoder().encode(e.data))
      } else console.error('Cannot handle data', e.data)
    }
    webSocket.addEventListener('message', listener)
  }), {
    onClose: () => webSocket.removeEventListener('message', listener)
  }) as AsyncIterableIterator<Uint8Array>
}

export default webSocketToIterator
