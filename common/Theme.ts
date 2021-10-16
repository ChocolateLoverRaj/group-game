import localStorage from 'mobx-localstorage'
import { makeObservable, computed } from 'mobx'
import { matchMedia } from 'mobx-matchmedia'

export enum ThemeEnum {
  LIGHT,
  DARK
}

const localStorageKey = 'selectedTheme'

export class Theme {
  constructor () {
    makeObservable(this, {
      theme: computed,
      selectedTheme: computed
    })
  }

  get theme (): ThemeEnum {
    return localStorage.getItem(localStorageKey) ?? (matchMedia('(prefers-color-scheme: light)')
      ? ThemeEnum.LIGHT
      : ThemeEnum.DARK)
  }

  get selectedTheme (): ThemeEnum | null {
    return localStorage.getItem(localStorageKey)
  }

  set selectedTheme (theme: ThemeEnum | null) {
    if (theme !== null) localStorage.setItem(localStorageKey, theme)
    else localStorage.delete(localStorageKey)
  }
}

export const theme = new Theme()
