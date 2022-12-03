import { ethers } from "hardhat";

export async function getGameContract() {
  const Game = await ethers.getContractFactory("Game");
  const game = await Game.attach("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
    
  return game;
}