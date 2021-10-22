import addEventListenerOnce, { AddEventListenerAble } from './AddEventListenerOnce'

/**
 * Like addEventListenerOnce, but also looks for the error event.
 */
const aelOnceWithError = async <T extends unknown[] = any[], E = string>(
  addEventListenerAble: AddEventListenerAble<T, E>,
  event: E
): Promise<T> => await new Promise((resolve, reject) => {
  addEventListenerOnce(addEventListenerAble, event).then(resolve, reject)
  addEventListenerOnce<T, E | 'error'>(addEventListenerAble, 'error').then(reject, reject)
})

export default aelOnceWithError
