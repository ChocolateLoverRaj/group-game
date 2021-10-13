import { FC } from 'react'
import App from '../common/App'
import { dialog } from '@electron/remote'

const ElectronApp: FC = () =>
  <App
    environment='Electron'
    dialog={() => dialog.showMessageBoxSync({ message: 'Hello' })}
  />

export default ElectronApp
