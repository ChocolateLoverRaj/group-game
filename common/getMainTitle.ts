import Api from './Api'

const getMainTitle = ({ version }: Api): string => `Group Game v${version}`

export default getMainTitle
