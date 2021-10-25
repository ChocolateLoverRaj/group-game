import { observer } from 'mobx-react-lite'
import defaultWsPort from '../common/defaultWsPort'
import PortForm, { Validate } from './PortForm'
import WsHostService from './WsHostService'
import { once } from 'events'
import { game } from '../common/Game'

const HostWs = observer(() => {
  const host = game.hostServices?.get('ws') as WsHostService | undefined

  const validate: Validate = async port => {
    const host = new WsHostService(port)
    try {
      await once(host.server, 'listening')
    } catch (e) {
      console.error('Error creating server', e)
      throw new Error('Error creating server')
    }
  }

  return (
    <PortForm
      defaultPort={defaultWsPort}
      validate={validate}
      on={host !== undefined
        ? {
            port: host.port,
            onStop: async () => await host.stop()
          }
        : undefined}
    />
  )
})

export default HostWs
