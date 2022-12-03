const { ethers, upgrades } = require("hardhat");  
let BOX_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
// set BOX_ADDRESS to box.address, the address of the proxy.

async function main() {
    console.log("reza");
    const BoxV2 = await ethers.getContractFactory("Game"); // get the new contract (version 2)      
    const box = await upgrades.upgradeProxy(BOX_ADDRESS, BoxV2); 
    console.log(box.address);
    // set proxy's impementation to BOXV2    
    console.log("Box upgraded"); 
    // when it's done it prints "box upgraded".
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });