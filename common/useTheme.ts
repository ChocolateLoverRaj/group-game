import { useLayoutEffect } from 'react'
import light from './globalStyles/light.lazy.css'
import dark from './globalStyles/dark.lazy.css'

const useTheme = (): void => {
  useLayoutEffect(() => {
    const result = matchMedia('(prefers-color-scheme: dark)')
    let wasDark = result.matches
    ;(wasDark ? dark : light).use()
    const onChange = (): void => {
      (wasDark ? dark : light).unuse()
      wasDark = result.matches
      ;(wasDark ? dark : light).use()
    }
    result.addEventListener('change', onChange)
    return () => result.removeEventListener('change', onChange)
  }, [])
}

export default useTheme
