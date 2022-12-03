import { ethers } from "hardhat";
import { getGameContract } from "./getContract";

async function main() {
  const [owner] = await ethers.getSigners();

  const game = await getGameContract();

  const tx = await game.transfer("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 20);
  console.log(tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
