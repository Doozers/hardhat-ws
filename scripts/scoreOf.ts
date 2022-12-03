import { ethers } from "hardhat";
import { getGameContract } from "./getContract"

async function main() {
  const [owner] = await ethers.getSigners();

  const game = await getGameContract();

  const tx = await game.scoreOf(owner.address);
  console.log(tx); 
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
