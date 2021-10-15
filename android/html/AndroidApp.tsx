import { FC } from 'react'
import App from '../../common/App'

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Android {
  const dialog: () => void
}

const AndroidApp: FC = () =>
  <App
    environment='Android'
    dialog={() => Android.dialog()}
  />

export default AndroidApp
