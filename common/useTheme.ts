import { useLayoutEffect } from 'react'
import light from './globalStyles/light.lazy.css'
import dark from './globalStyles/dark.lazy.css'
import { theme, ThemeEnum } from './Theme'
import { usePreviousDifferent } from 'rooks'

/**
 * Must be called in an observer
 */
const useTheme = (): void => {
  const previousTheme = usePreviousDifferent(theme.theme)

  useLayoutEffect(() => {
    if (previousTheme !== null) (previousTheme === ThemeEnum.LIGHT ? light : dark).unuse()
    ;(theme.theme === ThemeEnum.LIGHT ? light : dark).use()
  }, [previousTheme, theme.theme])
}

export default useTheme
