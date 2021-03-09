const FarmContract = artifacts.require("Farm");
// const DaiToken = artifacts.require("DaiToken");
// const DappToken = artifacts.require("DappToken");

module.exports = async function(deployer, network, accounts) {
  // Deploy Mock DAI Token
  // await deployer.deploy(DaiToken)
  // const daiToken = await DaiToken.deployed()

  // // Deploy Dapp Token
  // await deployer.deploy(DappToken)
  // const dappToken = await DappToken.deployed()
  console.log(accounts[0]);
  // Deploy TokenFarm
  await deployer.deploy(FarmContract)
  const tokenFarm = await FarmContract.deployed()

  // Transfer all tokens to TokenFarm (1 million)
  // await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')

  // // Transfer 100 Mock DAI tokens to investor
  // await daiToken.transfer(accounts[1], '100000000000000000000')
}