import { ethers, upgrades } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners()

  const Box = await ethers.getContractFactory("Game"); 
  // get the MyContact which return 1    
  const game = await upgrades.deployProxy(Box); 
  // deploy the proxy and the contract        
  await game.deployed();
  
  // show the contract address once it's deployed 
  console.log("Box deployed to:", game.address); 
  
  console.log(`Game deployed to ${game.address}`);

  const res = await game.isRegistered(owner.address);
  console.log("addr:", owner.address);
  console.log(res);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
