import { action, computed, makeObservable, observable } from 'mobx'
import { Key, ReactNode } from 'react'
import { game } from './Game'

export abstract class ClientService {
  constructor () {
    makeObservable(this, {
      stop: action,
      connected: computed,
      players: observable,
      afterStopped: action
    })
  }

  afterStopped (): void {
    game.playing = false
  }

  abstract stop (): void
  abstract get connected (): boolean
  readonly players: Map<string, undefined> = new Map()
}

export type OnJoin = (clientService: ClientService) => void

export type Validate = () => Promise<boolean>

export interface JoinMethod {
  key: Key
  name: ReactNode
  render: (validate: Validate, onJoin: OnJoin) => ReactNode
}

export abstract class HostService {
  constructor () {
    makeObservable(this, {
      stop: action,
      players: computed,
      afterStarted: action,
      afterStopped: action
    })
  }

  abstract readonly key: Key
  afterStarted (): void {
    game.hostServices?.set(this.key, this)
  }

  afterStopped (): void {
    game.hostServices?.delete(this.key)
  }

  abstract stop (): void
  abstract get players (): Map<string, undefined>

  abstract onPlayerJoin (name: string): void

  abstract onPlayerLeave (name: string): void
}

export type OnHost<T extends HostService> = (host: T) => void

export interface HostMethod {
  key: Key
  name: ReactNode
  render: () => ReactNode
}

export interface Api {
  tagPrefix: string
  version: string
  getLink: (url: string, contents: ReactNode) => ReactNode
  additionalRoutes?: ReactNode
  joinMethods: JoinMethod[]
  hostMethods: HostMethod[]
}
