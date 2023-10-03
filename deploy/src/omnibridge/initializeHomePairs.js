const { web3Home, deploymentAddress } = require('../web3')
const { HomeOmnibridge } = require('../loadContracts')
const { sendRawTxHome } = require('../deploymentUtils')
const { TokenPairs } = require('../constants');

async function initialize({
  homeBridge,
}) {
  let nonce = await web3Home.eth.getTransactionCount(deploymentAddress)
  const contract = new web3Home.eth.Contract(HomeOmnibridge.abi, homeBridge)

  console.log('\n[Home] Initializing Token Pairs:')
  
  for (let i = 0; i < TokenPairs.length; i++) {
    console.log(` [${i}] - `, TokenPairs[i].Foreign, TokenPairs[i].Home)
    const setPairData = contract.methods.setForeignNativeToken(TokenPairs[i].Home, TokenPairs[i].Foreign).encodeABI()
  
    await sendRawTxHome({
      data: setPairData,
      nonce: nonce++,
      to: homeBridge,
    })
  }
}

module.exports = initialize
