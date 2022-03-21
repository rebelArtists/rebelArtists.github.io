const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  const RebelArtists = await hre.ethers.getContractFactory("RebelArtists");
  const rebelToken = await RebelArtists.deploy();

  await rebelToken.deployed();

  console.log("Rebel Token deployed to:", rebelToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
