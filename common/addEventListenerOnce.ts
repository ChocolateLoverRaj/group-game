export interface AddEventListenerAble<T extends unknown[], E> {
  addEventListener: (event: E, handler: (...event: T) => void) => void
}
const addEventListenerOnce = async <T extends unknown[] = any[], E = string>(
  addEventListenerAble: AddEventListenerAble<T, E>,
  event: E
): Promise<T> => await new Promise(resolve => {
  addEventListenerAble.addEventListener(event, (...event) => resolve(event))
})

export default addEventListenerOnce
