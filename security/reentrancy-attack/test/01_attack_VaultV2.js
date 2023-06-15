const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("VaultV2", function () {

  let vaultContract, attackerContract;
  let ownerAccount, user1Account, attackerAccount;

  before(async () => {
    [ownerAccount, user1Account, attackerAccount] = await ethers.getSigners();
    vaultContract = await ethers.deployContract("VaultV2"); 
  });

  describe("Attack scenario with VaultV2 - update balance first as protection", function () {
    const USER_STORE_AMOUNT = ethers.parseEther("10");
    const ATTACKER_STORE_AMOUNT = ethers.parseEther("0.1");

    it("user store 10 eth on vault", async function () {
      // WHEN
      const storeTx = await vaultContract.connect(user1Account).store({ value: USER_STORE_AMOUNT });
      // THEN
      expect(await vaultContract.balances(user1Account.address)).to.equal(USER_STORE_AMOUNT);
      expect(storeTx).emit(vaultContract, 'Stored')
        .withArgs(user1Account.address, USER_STORE_AMOUNT);
    });

    it("attacker deploy a proxy contract & store 0.1 eth to prepare the attack", async function () {
      // GIVEN 
      attackerContract = await ethers.deployContract("Attacker", [await vaultContract.getAddress()], attackerAccount);
      // WHEN
      const storeTx = await attackerContract.connect(attackerAccount).store({ value: ATTACKER_STORE_AMOUNT });
      // THEN
      expect(await vaultContract.balances(await attackerContract.getAddress())).equals(ATTACKER_STORE_AMOUNT);
      expect(storeTx).emit(vaultContract, 'Stored')
        .withArgs(attackerContract, ATTACKER_STORE_AMOUNT); 
    });
   
    it("attacker start the attach should failed to get more than his initial stored amount", async function () {
      // WHEN
      await attackerContract.connect(attackerAccount).redeem();
      // THEN
      expect(await attackerContract.connect(attackerAccount).getAttackerBalance()).equals(BigInt(0));
    });

  });

});
