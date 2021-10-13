import { FC } from 'react'
import dot from './dot.png'

export interface AppProps {
  environment: string
  dialog: () => void
}

const App: FC<AppProps> = ({ environment, dialog }) => {
  return (
    <>
      Hello <br />
      Environment: {environment} <br />
      <img src={dot} alt='Dot' />
      <button onClick={dialog}>Show dialog</button>
    </>
  )
}

export default App
