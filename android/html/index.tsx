import { render } from 'react-dom'
import App from './AndroidApp'

(globalThis as any).androidCallbacks = new Map()

const app = document.getElementById('app')
render(<App />, app)
