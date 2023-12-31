const fs = require('fs')
const path = require('path')
const env = require('./src/loadEnv')
const {TokenPairs} = require('constants')

const { BRIDGE_MODE } = env

const deployResultsPath = path.join(__dirname, './bridgeDeploymentResults.json')

function writeDeploymentResults(data) {
  fs.writeFileSync(deployResultsPath, JSON.stringify(data, null, 4))
  console.log('Contracts Deployment have been saved to `bridgeDeploymentResults.json`')
}

async function deployOmnibridge() {
  const preDeploy = require('./src/omnibridge/preDeploy')
  const deployHome = require('./src/omnibridge/home')
  const deployForeign = require('./src/omnibridge/foreign')
  const initializeHome = require('./src/omnibridge/initializeHome')
  const initHomeNativeTokenPairs = require('./src/omnibridge/initializeHomePairs')
  const initNativeForeignTokenPairs = require('./src/omnibridge/initializeForeignPairs')
  const initializeForeign = require('./src/omnibridge/initializeForeign')
  await preDeploy()
  const {
    homeBridgeMediator,
    tokenFactory: homeTokenFactory,
    feeManager,
    gasLimitManager,
    forwardingRulesManager,
    WETHOmniRouter
  } = await deployHome()
  const { foreignBridgeMediator, tokenFactory: foreignTokenFactory } = await deployForeign()

  await initializeHome({
    homeBridge: homeBridgeMediator.address,
    foreignBridge: foreignBridgeMediator.address,
    tokenFactory: homeTokenFactory.address,
    feeManager: feeManager.address,
    gasLimitManager: gasLimitManager.address,
    forwardingRulesManager: forwardingRulesManager.address,
  })

  await initHomeNativeTokenPairs({
    homeBridge: homeBridgeMediator.address,
  });

  await initializeForeign({
    foreignBridge: foreignBridgeMediator.address,
    homeBridge: homeBridgeMediator.address,
    tokenFactory: foreignTokenFactory.address,
  })

  await initNativeForeignTokenPairs({
    foreignBridge: foreignBridgeMediator.address,
  });

  console.log('\nDeployment has been completed.\n\n')
  console.log(`[   Home  ] Bridge Mediator: ${homeBridgeMediator.address}`)
  console.log(`            WETH Routher   : ${WETHOmniRouter.address}`)
  console.log(`[ Foreign ] Bridge Mediator: ${foreignBridgeMediator.address}`)
  writeDeploymentResults({
    homeBridge: {
      homeBridgeMediator,
      WETHOmniRouter
    },
    foreignBridge: {
      foreignBridgeMediator,
    },
  })
}

async function main() {
  console.log(`Bridge mode: ${BRIDGE_MODE}`)
  switch (BRIDGE_MODE) {
    case 'OMNIBRIDGE':
      await deployOmnibridge()
      break
    default:
      console.log(BRIDGE_MODE)
      throw new Error('Please specify BRIDGE_MODE: OMNIBRIDGE')
  }
}

main().catch((e) => {
  console.log('Error:', e)
  process.exit(1)
})
