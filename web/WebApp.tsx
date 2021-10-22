import { FC } from 'react'
import App from '../common/App'
import packageJson from './package.json'
import last from 'last-element'
import { Route } from 'react-router-dom'
import NoMatch from './NoMatch'
import wsJoinMethod from '../common/wsJoinMethod'

const tagPrefix = last(packageJson.name.split('-'))

const WebApp: FC = () =>
  <App
    tagPrefix={tagPrefix}
    version={packageJson.version}
    getLink={(url, contents) => <a href={url}>{contents}</a>}
    additionalRoutes={<Route component={NoMatch} />}
    joinMethods={[wsJoinMethod]}
    hostMethods={[]}
  />

export default WebApp
