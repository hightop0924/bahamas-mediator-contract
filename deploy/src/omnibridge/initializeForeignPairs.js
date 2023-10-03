const { web3Foreign, deploymentAddress } = require('../web3')
const { ForeignOmnibridge } = require('../loadContracts')
const { sendRawTxForeign } = require('../deploymentUtils')
const { TokenPairs } = require('../constants');

async function initialize({
  foreignBridge
}) {
  let nonce = await web3Foreign.eth.getTransactionCount(deploymentAddress)
  const contract = new web3Foreign.eth.Contract(ForeignOmnibridge.abi, foreignBridge)

  console.log('\n[Foreign] Initializing Token Pairs:')
  
  for (let i = 0; i < TokenPairs.length; i++) {
    console.log(` [${i}] - ${TokenPairs[i].Foreign} <-> ${TokenPairs[i].Home}`)
    const setPairData = contract.methods.setForeignNativeToken(TokenPairs[i].Foreign, TokenPairs[i].Home).encodeABI()
  
    await sendRawTxForeign({
      data: setPairData,
      nonce: nonce++,
      to: foreignBridge,
    })
  }
}

module.exports = initialize
