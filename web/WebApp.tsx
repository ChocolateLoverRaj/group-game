import { FC } from 'react'
import App from '../common/App'

const WebApp: FC = () =>
  <App
    environment='Web'
    dialog={() => alert('Hello')}
  />

export default WebApp
