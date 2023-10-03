const env = require('./loadEnv')

const {
  HOME_WRAPPED_TOKEN_ADDRESS,
  FOREIGN_NATIVE_CURRENCY,
} = env

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const EXPLORER_TYPES = {
  ETHERSCAN: 'etherscan',
  BLOCKSCOUT: 'blockscout',
}
const REQUEST_STATUS = {
  OK: 'OK',
}

// HHW
// TODO : change to mainnet
const TokenPairs = [
  {
    Home: HOME_WRAPPED_TOKEN_ADDRESS,
    Foreign: FOREIGN_NATIVE_CURRENCY
  }
]

module.exports = {
  ZERO_ADDRESS,
  EXPLORER_TYPES,
  REQUEST_STATUS,
  TokenPairs
}
