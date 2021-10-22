/**
 * Get an array by getting the next `n` values in an iterator
 * @param asyncIterator The iterable
 * @param length The number of values to read
 * @returns An array the size of length. If the iterable ends before the length is reached, the array will be a shorter length
 */
const readAsyncIterator = async <T>(asyncIterator: AsyncIterator<T>, length = 1): Promise<T[]> => {
  const arr: T[] = []
  while (arr.length < length) {
    const { value, done } = await asyncIterator.next()
    if (done === true) return arr
    arr.push(value)
  }
  return arr
}

export default readAsyncIterator
