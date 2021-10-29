import defaultTcpPort from '../common/defaultTcpPort'
import { once } from 'events'
import TcpHostService from './TcpHostService'
import { game } from '../common/Game'
import { observer } from 'mobx-react-lite'
import PortForm, { Validate } from './PortForm'

const HostTcp = observer(() => {
  const host = game.hostServices?.get('tcp') as TcpHostService | undefined

  const validate: Validate = async port => {
    const host = new TcpHostService(port)
    try {
      await once(host.server, 'listening')
    } catch (e) {
      console.error('Error creating server', e)
      throw new Error('Error creating server')
    }
  }

  return (
    <PortForm
      defaultPort={defaultTcpPort}
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

export default HostTcp
