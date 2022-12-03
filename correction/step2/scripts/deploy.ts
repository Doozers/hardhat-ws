import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners()

  const Game = await ethers.getContractFactory("Game");
  const game = await Game.deploy();

  await game.deployed();

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
