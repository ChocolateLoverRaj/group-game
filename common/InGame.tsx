import { observer } from 'mobx-react-lite'
import { Fragment, useContext, MouseEventHandler } from 'react'
import Context from './Context'
import { game } from './Game'
import { Button, Table } from 'antd'
import { StarOutlined, TeamOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { action } from 'mobx'

const InGame = observer(() => {
  const { hostMethods } = useContext(Context)

  const handleLeave: MouseEventHandler = action(() => {
    if (game.isHost) {
      game.playing = false
      game.hostServices?.forEach(hostService => hostService.stop())
    } else game.clientService?.stop()
  })

  return (
    <>
      <h1>In Game</h1>
      <h2>Players <TeamOutlined /></h2>
      <Table
        dataSource={[...game.players]}
        columns={[{
          title: 'Name',
          dataIndex: 0,
          key: 'name'
        }, {
          title: 'Is Host',
          key: 'isHost',
          render: (_0, _1, c) => c === 0 && <StarOutlined />
        }, {
          title: 'Is you',
          key: 'isYou',
          render: name => name === game.myName && 'You',
          dataIndex: 0
        }]}
        rowKey='0'
        pagination={{ hideOnSinglePage: true }}
      />
      {game.isHost && (
        <>
          <h2>Invite Players <UsergroupAddOutlined /></h2>
          {hostMethods.map(({ key, name, render }) => (
            <Fragment key={key}>
              <h3>{name}</h3>
              {render()}
            </Fragment>
          ))}
        </>)}
      <Button danger onClick={handleLeave}>Leave Game</Button>
    </>
  )
})

export default InGame
