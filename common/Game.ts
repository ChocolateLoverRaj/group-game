import { action, computed, makeObservable, observable } from 'mobx'
import { Key } from 'react'
import { ClientService, HostService } from './Api'
import never from 'never'

export class Game {
  myName = ''
  playing = false
  isHost = false
  clientService?: ClientService = undefined
  hostServices?: Map<Key, HostService> = undefined

  constructor () {
    makeObservable(this, {
      playing: observable,
      isHost: observable,
      clientService: observable,
      myName: observable,
      hostServices: observable,
      players: computed,
      onPlayerJoin: action,
      onPlayerLeave: action
    })
  }

  /**
   * Host is always first player
   */
  get players (): Map<string, undefined> {
    return this.isHost
      ? new Map([
        [this.myName, undefined],
        ...[...(this.hostServices ?? never()).values()].flatMap(({ players }) => [...players])
      ])
      : (this.clientService ?? never()).players
  }

  /**
   * Only call from host service
   */
  onPlayerJoin (name: string): void {
    for (const service of (this.hostServices ?? never()).values()) service.onPlayerJoin(name)
  }

  /**
   * Only call from host service
   */
  onPlayerLeave (name: string): void {
    for (const service of (this.hostServices ?? never()).values()) service.onPlayerLeave(name)
  }
}

export const game = new Game()
