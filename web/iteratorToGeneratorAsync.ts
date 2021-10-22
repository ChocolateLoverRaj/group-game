async function * iteratorToGeneratorAsync <T> (asyncIterator: AsyncIterator<T>): AsyncGenerator<T> {
  while (true) {
    const { value, done } = await asyncIterator.next()
    if (done === true) return
    yield value
  }
}

export default iteratorToGeneratorAsync
