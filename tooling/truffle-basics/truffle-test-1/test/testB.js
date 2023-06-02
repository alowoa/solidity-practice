const Storage = artifacts.require("./Storage.sol");

const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const constants = require('@openzeppelin/test-helpers/src/constants');


contract("Storage", accounts => {

    const owner = accounts[0];

    it("...should retrieve a stored value ", async () => {
        //GIVEN
        const storageInstance = await Storage.deployed();
        const newValue = 89; 
        // WHEN set newValue & getStored
        await storageInstance.set(newValue, { from: owner });
        const storedData = await storageInstance.get.call();
        //THEN
        assert.equal(storedData, newValue,  `The value ${newValue} was not stored.`);
        expect(storedData).to.be.bignumber.equal(new BN(newValue));
    });

    it("...should emit event upon set newValue", async () => {
        //GIVEN
        const storageInstance = await Storage.deployed();
        const newValue = 89;
        // WHEN set newValue 
        const setTx = await storageInstance.set(newValue, { from: owner });
        // THEN 
        expectEvent(setTx, 'DataStored', { _data: new BN(newValue) });     
    }); 
    
    //FIXME
    it("...should revert upon a set 0 value.", async () => {
        //GIVEN
        const storageInstance = await Storage.deployed();
        //WHEN
        const settx = await storageInstance.set(0, { from: owner });
        // THEN
        await expectRevert(settx, "Setting 0 is not allowed!");
    });

    //FIXME
    it("...should revert with SatanError upon a set 666 value.", async () => {
        //GIVEN
        const storageInstance = await Storage.deployed();
        //WHEN
        const settx = await storageInstance.set(666, { from: owner });
        // THEN
        await expectRevert(settx, "SatanError");
    });

});
