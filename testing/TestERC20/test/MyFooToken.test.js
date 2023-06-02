const MyFooToken = artifacts.require("./MyFooToken.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');


contract("MyFooToken", accounts => {
    const NAME = "MyFooToken";
    const SYMBOL = "MFT";
    const INITIAL_SUPPLY = new BN(10000);
    const OWNER = accounts[0];
    const RECIPIENT = accounts[1];
    const DECIMAL = new BN(18);

    let myFooToken;

    beforeEach(async () => {
        myFooToken = await MyFooToken.new(INITIAL_SUPPLY, {from: OWNER});
    });

    it("has a name", async () => {
        expect(await myFooToken.name()).to.equal(NAME);
    });

    it("has a symbol", async () => {
        expect(await myFooToken.symbol()).to.equal(SYMBOL);
    });

    it("has a decimal", async () => {
        expect(await myFooToken.decimals()).to.be.bignumber.equal(DECIMAL);
    });

    it("check first balance", async () => {
        expect(await myFooToken.balanceOf(OWNER)).to.be.bignumber.equal(INITIAL_SUPPLY);
    });

    it("check balance after transfer", async () => {
        expect(await myFooToken.balanceOf(RECIPIENT)).to.be.bignumber.equal(new BN(0));
        const ownerBalance = await myFooToken.balanceOf(OWNER);
        const recipientBalance = await myFooToken.balanceOf(RECIPIENT);
        const transferAmount = new BN(100);

        await myFooToken.transfer(RECIPIENT, new BN(transferAmount), {from: OWNER});

        expect(await myFooToken.balanceOf(OWNER)).to.be.bignumber.equal(ownerBalance.sub(transferAmount));
        expect(await myFooToken.balanceOf(RECIPIENT)).to.be.bignumber.equal(recipientBalance.add(transferAmount));
    });

    it("check approval of RECIPIENT on OWNER balance", async () => {
        //GIVEN
        const allowanceFromOwnerToRecipientAmount = await myFooToken.allowance(OWNER, RECIPIENT);
        //WHEN
        const approvedAmount = new BN(100);
        const approveTx = await myFooToken.approve(RECIPIENT, approvedAmount);
        //THEN
        expectEvent(approveTx, 'Approval', { owner: OWNER, spender: RECIPIENT, value: approvedAmount });
        expect(await myFooToken.allowance(OWNER, RECIPIENT)).to.be.bignumber.equal(allowanceFromOwnerToRecipientAmount.add(approvedAmount));
    });

    it("check transfer as RECIPIENT from OWNER balance to RECIPIENT", async () => {
        // GIVEN an allowance of at least 100
        const approvedAmount = new BN(100);
        await myFooToken.approve(RECIPIENT, approvedAmount, {from: OWNER});
        const totalApprovedAmount = await myFooToken.allowance(OWNER, RECIPIENT);
        //WHEN transfer 30
        const transferAmount = new BN(30);
        const isTransferedTx = await myFooToken.transferFrom(OWNER, RECIPIENT, transferAmount, {from: RECIPIENT});
        //THEN 
        expectEvent(isTransferedTx, 'Transfer', { from: OWNER, to: RECIPIENT, value: transferAmount });
        expect(await myFooToken.allowance(OWNER, RECIPIENT)).to.be.bignumber.equal(totalApprovedAmount.sub(transferAmount));
    });

});

