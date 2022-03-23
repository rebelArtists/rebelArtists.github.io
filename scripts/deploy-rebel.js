const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying Token from account:", deployer.address);
  const RebelArtists = await hre.ethers.getContractFactory("RebelArtists");
  const rebelToken = await RebelArtists.deploy();
  await rebelToken.deployed();
  console.log("Token deployed to:", rebelToken.address);

  console.log("Deploying Crowdsale from account:", deployer.address);
  const RebelCrowdsale = await hre.ethers.getContractFactory("RebelTokenCrowdsale");
  const rebelCrowdsale = await RebelCrowdsale.deploy(rebelToken.address);
  await rebelCrowdsale.deployed();
  console.log("Crowdsale deployed to:", rebelCrowdsale.address);

  console.log("Deploying main Rebel DAPP from account:", deployer.address);
  const RebelDapp = await hre.ethers.getContractFactory("Rebel");
  const rebel = await RebelDapp.deploy(rebelToken.address, rebelCrowdsale.address);
  await rebel.deployed();
  console.log("Rebel DAPP deployed to:", rebel.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
