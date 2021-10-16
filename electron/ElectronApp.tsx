import { FC } from 'react'
import App from '../common/App'
import { dialog } from '@electron/remote'
import packageJson from './package.json'
import last from 'last-element'

const tagPrefix = last(packageJson.name.split('-'))

const ElectronApp: FC = () =>
  <App
    environment={{ tagPrefix, displayName: 'Electron' }}
    dialog={() => dialog.showMessageBoxSync({ message: 'Hello' })}
    version={packageJson.version}
    getLink={(url, contents) => <a target='_blank' rel='noreferrer' href={url}>{contents}</a>}
  />

export default ElectronApp
