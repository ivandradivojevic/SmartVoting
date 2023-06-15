const { expect } = require("chai");

describe("Poll", function () {
  let poll;

  beforeEach(async function () {
    const Poll = await ethers.getContractFactory("Poll");
    poll = await Poll.deploy();
  });

  it("should add an option", async function () {
    await poll.addOption("Option 1");

    const optionsLength = await poll.getOptionsLength();
    expect(optionsLength).to.equal(1);
  });

  it("should vote for an option", async function () {
    await poll.addOption("Option 1");
    await poll.vote(0);

    const votes = await poll.votes(0);
    expect(votes).to.equal(1);
  });

  it("should count votes and declare winner", async function () {
    await poll.addOption("Option 1");
    await poll.addOption("Option 2");
    await poll.vote(0);

    await poll.countVotesAndDeclareWinner();
    poll.on('WinnerDeclared', (winningOptionId) => {
      expect(winningOptionId).to.equal(0);
    });
  });

  it("should throw an error when address has already voted", async function () {
    await poll.addOption("Option 1");
    await poll.vote(0);

    // Attempt to vote again, which should throw an error
    await expect(poll.vote(0)).to.be.revertedWith("Address has already voted.");
  });

});
