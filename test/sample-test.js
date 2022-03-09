const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CreateUser", function () {
  it("Should return correct user info and first index", async function () {
    const Rebel = await ethers.getContractFactory("SocialHelper");
    const rebel = await Rebel.deploy();
    await rebel.deployed();

    const userName = "satoshi";
    const userBio = "btc founder";
    const userProfPicHash = "vkg-rap.tej6nvt0ZFC";

    const newUser = await rebel.createUser(userName, userBio, userProfPicHash);
    // wait until the transaction is mined
    await newUser.wait();

    const userResp = await rebel.getUserByName(userName);
    expect(userResp.name).to.equal("satoshi");
    expect(userResp.bio).to.equal("btc founder");
    expect(userResp.profPicHash).to.equal("vkg-rap.tej6nvt0ZFC");
    expect(userResp.id.toNumber()).to.equal(0);
    expect(userResp.amtEarned.toNumber()).to.equal(0);
  });
});

describe("CreateMultipleUsersDiffAccounts", function () {
  it("Should return second user's correct info and index", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Rebel = await ethers.getContractFactory("SocialHelper");
    const rebel = await Rebel.deploy();
    await rebel.deployed();

    const userName1 = "satoshi";
    const userBio1 = "btc founder";
    const userProfPicHash1 = "vkg-rap.tej6nvt0ZFC";

    const userName2 = "finney";
    const userBio2 = "first btc tx";
    const userProfPicHash2 = "azv5dbk.XEQ8nmr0nah";

    const newUser1 = await rebel.createUser(userName1, userBio1, userProfPicHash1);
    await newUser1.wait();

    const newUser2 = await rebel.connect(addr1).createUser(userName2, userBio2, userProfPicHash2);
    await newUser2.wait();

    const userResp = await rebel.getUserByName(userName2);
    expect(userResp.name).to.equal("finney");
    expect(userResp.bio).to.equal("first btc tx");
    expect(userResp.profPicHash).to.equal("azv5dbk.XEQ8nmr0nah");
    // should be 2nd user in mapping
    expect(userResp.id.toNumber()).to.equal(1);
    expect(userResp.amtEarned.toNumber()).to.equal(0);
  });
});

describe("CreateMultipleUsersFromSameAccount", function () {
  it("Should fail as only one user allowed per account", async function () {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const Rebel = await ethers.getContractFactory("SocialHelper");
    const rebel = await Rebel.deploy();
    await rebel.deployed();

    const userName1 = "satoshi";
    const userBio1 = "btc founder";
    const userProfPicHash1 = "vkg-rap.tej6nvt0ZFC";

    const userName2 = "finney";
    const userBio2 = "first btc tx";
    const userProfPicHash2 = "azv5dbk.XEQ8nmr0nah";

    const newUser1 = await rebel.connect(addr1).createUser(userName1, userBio1, userProfPicHash1);
    await newUser1.wait();

    const sameAcctUser = async function () {
      let err = null;
      try {
        const newUser2 = await rebel.connect(addr1).createUser(userName2, userBio2, userProfPicHash2);
        await newUser2.wait();
      } catch (error) {
        err = error
      }
        expect(err).to.be.an('error');
    };

    await sameAcctUser()

  });
});
