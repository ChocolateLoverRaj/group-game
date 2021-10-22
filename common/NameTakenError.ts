class NameTakenError extends Error {
  constructor () {
    super('Name taken')
  }
}

export default NameTakenError
