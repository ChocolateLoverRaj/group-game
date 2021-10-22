import { FC } from 'react'
import App from '../../common/App'
import packageJson from './package.json'
import last from 'last-element'
import wsJoinMethod from '../../common/wsJoinMethod'

// eslint-disable-next-line @typescript-eslint/no-namespace
/* declare namespace Android {
} */

const tagPrefix = last(packageJson.name.split('-'))

const AndroidApp: FC = () =>
  <App
    tagPrefix={tagPrefix}
    version={packageJson.version}
    getLink={(url, contents) => <a href={url}>{contents}</a>}
    joinMethods={[wsJoinMethod]}
    hostMethods={[]}
  />

export default AndroidApp
