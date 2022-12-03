import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { parseEther } from "@ethersproject/units";

describe("Game", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployGameFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Game = await ethers.getContractFactory("Game");
    const game = await Game.deploy();

    await game.deployed();

    return { game, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { game, owner } = await loadFixture(deployGameFixture);

      expect(await game.owner())
        .to.equal(owner.address);
    });
  });
  
  describe("Modifier", function() {
    it("Should receive and store the funds to lock", async function () {
      const { game } = await loadFixture(deployGameFixture);

      expect(game.play())
        .to.be.revertedWith("You can't play without being registered");
    });
  });

  describe("Register", function () {
    it("Should fail if player register many times", async function() {
      const { game, addr1 } = await loadFixture(deployGameFixture);

      await game.connect(addr1).register({value: parseEther("0.1")});

      expect(game.connect(addr1).register({value: parseEther("0.1")}))
        .to.be.revertedWith("You are already registered.");
    });

    it("Should fail if player doesn't send enough money to register", async function() {
      const { game, addr1 } = await loadFixture(deployGameFixture);

      expect(
        game.connect(addr1).register({value: parseEther("0.05")})
      ).to.be.revertedWith("You must send 0.1 ether to register.")
    });

    it("Should transfer user's money to owner and register him", async function() {
      const { game, owner, addr1 } = await loadFixture(deployGameFixture);

      let ownerBalance = await owner.getBalance();
      let addr1Balance = await addr1.getBalance();

      await game.connect(addr1).register({value: parseEther("0.1")});
      
      await expect(await owner.getBalance())
        .to.equal(ownerBalance.add(parseEther("0.1")));

      await expect(await addr1.getBalance())
        .to.lessThan(addr1Balance.sub(parseEther("0.1")))

      expect(await game.isRegistered(addr1.address))
        .to.equal(true)
    });
  })

  describe("Play", function() {
    it("Should fail if player is not registered", async function() {
      const { game, addr1} = await loadFixture(deployGameFixture);

      expect(game.connect(addr1).play())
        .to.be.revertedWith("You can't play without being registered");
    });

    it("Should increase score and emit an event when a play play", async function() {
      const {game, addr1 } = await loadFixture(deployGameFixture);

      await game.connect(addr1).register({value: parseEther("0.1")});

      await expect(game.connect(addr1).play())
        .to.emit(game, "Play").withArgs(addr1.address);

      expect(await game.scoreOf(addr1.address))
        .to.equal(10);
    });
  });

  describe("Transfer", function() {
    it("Should fail if player doesn't have enough score", async function() {
      const { game, addr1, addr2 } = await loadFixture(deployGameFixture);

      await game.connect(addr1).register({value: parseEther("0.1")});
      await game.connect(addr2).register({value: parseEther("0.1")});

      expect(game.connect(addr1).transfer(addr2.address, 10))
        .to.be.revertedWith("You can't send more than you own.");
    });

    it("Should fail if the second player isn't registered", async function () {
      const { game, addr1, addr2 } = await loadFixture(deployGameFixture);

      await game.connect(addr1).register({value: parseEther("0.1")});
      await game.connect(addr1).play();

      expect(game.connect(addr1).transfer(addr2.address, 10))
        .to.be.revertedWith("You can't send money to a non-registered account.");
    });

    it("Should transfer score and emit an event", async function () {
      const { game, addr1, addr2 } = await loadFixture(deployGameFixture);

      await game.connect(addr1).register({value: parseEther("0.1")});
      await game.connect(addr2).register({value: parseEther("0.1")});

      await game.connect(addr1).play()

      await expect(game.connect(addr1).transfer(addr2.address, 10))
        .to.emit(game, "Transfer").withArgs(addr1.address, addr2.address, 10);

      await expect(await game.scoreOf(addr1.address)).to.equal(0);
      expect(await game.scoreOf(addr2.address)).to.equal(10);
    })
  });
});


