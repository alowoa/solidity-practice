const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Vault", function () {

  let vault, attackerContract;
  let owner, user, attacker;

  before(async () => {
    [owner, user, attacker] = await ethers.getSigners();

    vault = await ethers.deployContract("Vault");

    const Attacker = await ethers.getContractFactory("Attacker");
    attackerContract = await Attacker.deploy(vault);
    // await attackerContract.deployed();
  });

  describe("Attack scenario", function () {
    const emittedEvents = [];
    const saveEvents = async (tx) => {
      const receipt = await tx.wait()
      receipt.events.forEach(ev => {
        if (ev.event) {
          emittedEvents.push({
            name: ev.event,
            args: ev.args
          });
        }
      });
      console.log(`emittedEvents: `, emittedEvents);
    }

    const USER_STORE_AMOUNT = ethers.parseEther("1");
    const ATACKER_STORE_AMOUNT = ethers.parseEther("0.01");

    it("user store 1 eth ", async function () {
      // WHEN
      const storeTx = await vault.connect(user).store({ value: USER_STORE_AMOUNT });
      // THEN
      expect(await vault.balances(user.address)).to.equal(USER_STORE_AMOUNT);
      expect(storeTx).emit(vault, 'Stored')
        .withArgs(user.address, USER_STORE_AMOUNT);
    });

    // it("attacker store 0.01 eth ", async function () {
    //   // WHEN
    //   const storeTx = await vault.connect(attacker).store({value: ATACKER_STORE_AMOUNT});
    //   // THEN
    //   expect(await vault.balances(attacker.address)).to.equal(ATACKER_STORE_AMOUNT);
    //   expect(storeTx).emit(vault, 'Stored')
    //     .withArgs(user.address, ATACKER_STORE_AMOUNT);
    // });

    it("attacker store 0.01 eth ", async function () {
      // WHEN
      const storeTx = await attackerContract.connect(attacker).store({ value: ATACKER_STORE_AMOUNT });
      // THEN
      expect(await vault.balances(attackerContract)).to.equal(ATACKER_STORE_AMOUNT);
      expect(storeTx).emit(vault, 'Stored')
        .withArgs(attackerContract, ATACKER_STORE_AMOUNT);
    });


    it("attacker redeem 0.01 eth ", async function () {
      // WHEN
      const redeemTx = await attackerContract.connect(attacker).redeem();
      saveEvents(redeemTx);

      // THEN
      expect(await vault.balances(attackerContract)).to.equal(0);
      expect(await vault.balances(user)).to.equal(0);

      let transactionHistory = "Transaction history:\n---\n";
      let userBalance = 0;
      emittedEvents.forEach(event => {
        if (event.name === 'RedeemCall') {
          transactionHistory += `RedeemCall: $${parseFloat(fromEth(event.args.amount))} \n`;
        } else if (event.name === 'Redeemed') {
          transactionHistory += `Redeemed: $${parseFloat(fromEth(event.args.amount))} \n`;
        } else if (event.name === 'FallbackCall') {
          transactionHistory += `FallbackCall: $${parseFloat(fromEth(event.args.amount))} \n`;
          userBalance -= parseFloat(fromEth(event.args.amount));
        }
      });
      transactionHistory += `---\nTotal balance: $${userBalance}`;
      console.log('\x1b[36m%s\x1b[0m', transactionHistory);
    });

  });

});
