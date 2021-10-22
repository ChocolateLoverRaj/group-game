import { observer } from 'mobx-react-lite'
import { game } from './Game'
import InGame from './InGame'
import NotInGame from './NotInGame'

const MainRoute = observer(() => game.playing ? <InGame /> : <NotInGame />)

export default MainRoute
