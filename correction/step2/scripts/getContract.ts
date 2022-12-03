import { ethers } from "hardhat";

export async function getGameContract() {
  const Game = await ethers.getContractFactory("Game");
  const game = await Game.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    
  return game;
}