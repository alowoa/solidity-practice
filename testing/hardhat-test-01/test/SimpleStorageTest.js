const { expect, assert } = require("chai");
const { BN } = require('@openzeppelin/test-helpers');
const expectEvent = require("@openzeppelin/test-helpers/src/expectEvent");

describe("SimpleStorage", function () {

  let SimpleStorage;
  let simpleStorage;

  before(async () => {
    [this.owner, this.addr1, this.addr2] = await ethers.getSigners();
    SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  });

  beforeEach(async () => {
    simpleStorage = await SimpleStorage.deploy(0);
  });

  describe("Initialization", function () {
    it('should get the number and the number should be equal to 0', async function () {
      let number = await simpleStorage.getNumber();
      expect(number.toString()).equal("0");
    })
  })

  describe("Set", function () {
    it('should set the number and get an updated number', async function () {
      let transaction = await simpleStorage.setNumber(7);
      await transaction.wait();
      let number = await simpleStorage.getNumber();
      expect(number).equal(new BN(7));
      expectEvent(transaction, 'ValueStored', {value: newValue})
    })
  });
});
