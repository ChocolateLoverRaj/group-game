import { FC } from 'react'
import useTheme from './useTheme'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { Api } from './Api'
import Context from './Context'
import Header from './Header'
import Settings from './Settings'
import { observer } from 'mobx-react-lite'
import Helmet from 'react-helmet'
import getMainTitle from './getMainTitle'
import MainRoute from './MainRoute'

const App: FC<Api> = observer(api => {
  useTheme()

  const { additionalRoutes } = api

  return (
    <>
      <Helmet>
        <title>{getMainTitle(api)}</title>
      </Helmet>
      <Context.Provider value={api}>
        <HashRouter>
          <Header />
          <Switch>
            <Route exact path='/' component={MainRoute} />
            <Route path='/settings' component={Settings} />
            {additionalRoutes}
          </Switch>
        </HashRouter>
      </Context.Provider>
    </>
  )
})

export default App
