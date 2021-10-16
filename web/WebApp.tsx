import { FC } from 'react'
import App from '../common/App'
import packageJson from './package.json'
import last from 'last-element'

const tagPrefix = last(packageJson.name.split('-'))

const WebApp: FC = () =>
  <App
    environment={{ tagPrefix, displayName: 'Web' }}
    dialog={() => alert('Hello')}
    version={packageJson.version}
    getLink={(url, contents) => <a href={url}>{contents}</a>}
  />

export default WebApp
