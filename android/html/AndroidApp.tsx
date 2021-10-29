import { FC } from 'react'
import App from '../../common/App'
import packageJson from './package.json'
import last from 'last-element'
import wsJoinMethod from '../../common/wsJoinMethod'
import JoinTcp from './JoinTcp'

const tagPrefix = last(packageJson.name.split('-'))

const AndroidApp: FC = () =>
  <App
    tagPrefix={tagPrefix}
    version={packageJson.version}
    getLink={(url, contents) => <a href={url}>{contents}</a>}
    joinMethods={[wsJoinMethod, {
      key: 'tcp',
      name: 'Connect to TCP Server',
      render: (validate, onJoin) => <JoinTcp validate={validate} onJoin={onJoin} />
    }]}
    hostMethods={[]}
  />

export default AndroidApp
