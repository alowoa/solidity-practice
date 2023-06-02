const Storage = artifacts.require("./Storage.sol");

contract("Storage", accounts => {
    it("...should store the value 89.", async () => {
        const storageInstance = await Storage.deployed();

        // Set value of 89
        await storageInstance.set(89, { from: accounts[0] });

        // Get stored value
        const storedData = await storageInstance.get.call();
        assert.equal(storedData, 89, "The value 89 was not stored.");
    });
});
