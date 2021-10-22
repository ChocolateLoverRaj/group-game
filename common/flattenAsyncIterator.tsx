async function * flattenAsyncIterable <T> (
  asyncIterable: AsyncIterable<Iterable<T>> | AsyncGenerator<Iterable<T>>
): AsyncGenerator<T> {
  for await (const arr of asyncIterable) {
    for (const value of arr) yield value
  }
}

export default flattenAsyncIterable
