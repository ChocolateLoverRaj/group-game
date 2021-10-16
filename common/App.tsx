import { FC } from 'react'
import dot from './dot.png'
import { Button } from 'antd'
import useTheme from './useTheme'
import { HashRouter, Switch, Route } from 'react-router-dom'
import Api from './Api'
import Context from './Context'
import Header from './Header'
import Settings from './Settings'
import { observer } from 'mobx-react-lite'

const App: FC<Api> = observer(api => {
  useTheme()

  const { environment: { displayName }, dialog, additionalRoutes } = api

  return (
    <Context.Provider value={api}>
      <HashRouter>
        <Header />
        <Switch>
          <Route exact path='/'>
            Environment: {displayName} <br />
            <img src={dot} alt='Dot' />
            <Button onClick={dialog}>Show dialog</Button>
          </Route>
          <Route path='/settings' component={Settings} />
          {additionalRoutes}
        </Switch>
      </HashRouter>
    </Context.Provider>
  )
})

export default App
