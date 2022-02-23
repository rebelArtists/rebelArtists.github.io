const hre = require('hardhat')

async function main() {
  const [deployer] = await hre.ethers.getSigners()

  console.log(
    'Deploying contracts with the account:',
    deployer.address,
  )
  const InstagramPosting = await hre.ethers.getContractFactory('InstagramPosting')
  const wave = await InstagramPosting.deploy()

  await wave.deployed()

  console.log('Wave portal deployed to:', wave.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
