import { ethers } from "hardhat";
import { Game } from "../typechain-types";
import { getGameContract } from "./getContract";

async function main() {
  const [owner] = await ethers.getSigners();

  const game: Game = await getGameContract();

  const tx = await game.play();
  console.log(tx);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
