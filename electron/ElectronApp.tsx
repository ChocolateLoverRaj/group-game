import { FC } from 'react'
import App from '../common/App'
import packageJson from './package.json'
import last from 'last-element'
import JoinTcp from './JoinTcp'
import HostTcp from './HostTcp'
import HostWs from './HostWs'
import wsJoinMethod from '../common/wsJoinMethod'

const tagPrefix = last(packageJson.name.split('-'))

const ElectronApp: FC = () =>
  <App
    tagPrefix={tagPrefix}
    version={packageJson.version}
    getLink={(url, contents) => <a target='_blank' rel='noreferrer' href={url}>{contents}</a>}
    joinMethods={[{
      key: 'tcp',
      name: 'Connect to TCP Server',
      render: (validate, onJoin) => <JoinTcp validate={validate} onJoin={onJoin} />
    }, wsJoinMethod]}
    hostMethods={[{
      key: 'tcp',
      name: 'Create TCP Server',
      render: () => <HostTcp />
    }, {
      key: 'ws',
      name: 'Create Web Socket Server',
      render: () => <HostWs />
    }]}
  />

export default ElectronApp
