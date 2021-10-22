import { createContext, Context as IContext } from 'react'
import { Api } from './Api'

const Context: IContext<Api> = (createContext as Function)()

export default Context
