import { useLayoutEffect } from 'react'
import light from './globalStyles/light.lazy.css'
import dark from './globalStyles/dark.lazy.css'
import theme from './theme'
import { usePreviousDifferent } from 'rooks'

/**
 * Must be called in an observer
 */
const useTheme = (): void => {
  const previousTheme = usePreviousDifferent(theme.theme)

  useLayoutEffect(() => {
    if (previousTheme !== null) (previousTheme === 'light' ? light : dark).unuse()
    ;(theme.theme === 'light' ? light : dark).use()
  }, [previousTheme, theme.theme])
}

export default useTheme
