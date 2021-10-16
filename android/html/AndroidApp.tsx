import { FC } from 'react'
import App from '../../common/App'
import packageJson from './package.json'
import last from 'last-element'

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Android {
  const dialog: () => void
}

const tagPrefix = last(packageJson.name.split('-'))

const AndroidApp: FC = () =>
  <App
    environment={{ tagPrefix, displayName: 'Android' }}
    dialog={() => Android.dialog()}
    version={packageJson.version}
    getLink={(url, contents) => <a href={url}>{contents}</a>}
  />

export default AndroidApp
