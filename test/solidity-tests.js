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
    // ensure no followers/following to begin
    expect(userResp.followers.toNumber()).to.equal(0);
    expect(userResp.following.toNumber()).to.equal(0);
    // ensure first index in usersMap
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

describe("FollowUserFlow", function () {
  it("Should increase follows for recipient and following for sender", async function () {
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

    // create user id = 0
    const newUser1 = await rebel.connect(addr1).createUser(userName1, userBio1, userProfPicHash1);
    await newUser1.wait();

    // create user id = 1
    const newUser2 = await rebel.connect(addr2).createUser(userName2, userBio2, userProfPicHash2);
    await newUser2.wait();

    // ensure follow counts are initially zero for each user
    const userThatsFollowing = await rebel.getUserByName(userName1);
    const userThatsFollowed = await rebel.getUserByName(userName2);
    expect(userThatsFollowing.following.toNumber()).to.equal(0);
    expect(userThatsFollowed.followers.toNumber()).to.equal(0);

    // get initial balances so we can compare money changes later
    const userThatsFollowingInitialBalance = await ethers.provider.getBalance(addr1.address);
    const userThatsFollowedInitialBalance = await ethers.provider.getBalance(addr2.address);

    // follow user id = 1
    const followUser = await rebel.connect(addr1).followUser(1, {
      value: ethers.utils.parseEther(".02"),
    });
    await followUser.wait();

    // get users again and see how stats have incremented
    const userFollowing = await rebel.getUserByName(userName1);
    const userFollowed = await rebel.getUserByName(userName2);
    expect(userFollowing.following.toNumber()).to.equal(1);
    expect(userFollowed.followers.toNumber()).to.equal(1);

    // 98% of .02 ETH is .0196 take for creator
    expect(ethers.utils.formatEther(userFollowed.amtEarned)).to.equal('0.0196');
    const userThatsFollowedFinalBalance = await ethers.provider.getBalance(addr2.address);
    const userThatsFollowingFinalBalance = await ethers.provider.getBalance(addr1.address);
    const followedDiff = ethers.utils.formatEther(userThatsFollowedFinalBalance) - ethers.utils.formatEther(userThatsFollowedInitialBalance);
    const followingDiff = ethers.utils.formatEther(userThatsFollowingInitialBalance) - ethers.utils.formatEther(userThatsFollowingFinalBalance);
    // small buffer to account for gas tx dust
    expect(followedDiff).to.be.at.least(0.0196);
    expect(followingDiff).to.be.at.least(0.02);

  });
});
