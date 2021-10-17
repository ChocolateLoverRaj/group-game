import { FC, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { theme, ThemeEnum } from './Theme'
import { Radio, RadioGroupProps } from 'antd'
import Helmet from 'react-helmet'
import getMainTitle from './getMainTitle'
import Context from './Context'

const Settings: FC = observer(() => {
  const api = useContext(Context)
  const selectedTheme = theme.selectedTheme ?? 'auto'

  const handleChange: RadioGroupProps['onChange'] = ({ target: { value } }) => {
    theme.selectedTheme = (value === 'auto' ? null : value)
  }

  return (
    <>
      <Helmet>
        <title>{`Settings \u25cf ${getMainTitle(api)}`}</title>
      </Helmet>
      <h1>Settings</h1>
      <h2>Theme</h2>
      <Radio.Group value={selectedTheme} onChange={handleChange}>
        <Radio value='auto'>Auto</Radio>
        <Radio value={ThemeEnum.DARK}>Dark</Radio>
        <Radio value={ThemeEnum.LIGHT}>Light</Radio>
      </Radio.Group>
    </>
  )
})

export default Settings
