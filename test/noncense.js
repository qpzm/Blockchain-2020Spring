const Noncense = artifacts.require("./Noncense");

let noncense;
contract("Noncense", accounts => {
  // Noncense.deployed() uses the same deployed contract in a file, which results in dependency between tests.
  // Noncense.new() resets the contract each it block.
  beforeEach(async () => { noncense = await Noncense.new() });

  it("newPost() should create new post with given contents", async () => {
    await noncense.newPost("Hello Noncense", 0, "", "");

    const post = await noncense.post.call(1);
    expect(post.body).to.equal("Hello Noncense");
  });

  it("getIdsByAuthor() should return post ids written by the author", async () => {
    // accounts[0] is the default msg.sender who wrote the root post, so use another one.
    const author = accounts[1];
    await noncense.newPost("", 0, "", "", { from: author });
    const postId = 1
    const postIds = await noncense.getIdsByAuthor(author, 0, 0)

    expect(postIds.map(x => x.toNumber())).to.eql([postId]);
  });

  it("getIdsByParentId() should return its children ids", async () => {
    await noncense.newPost("I'm the parent post!", 0, "", "");
    const parentId = 1

    await noncense.newPost("I'm the most recent post!", parentId, "", "");
    const childId = 2
    const childIds = await noncense.getIdsByParentId(parentId, 0, 0)

    // eql checks deep equality but equal checks strict equality.
    // e.g. expect([1, 2]).not.to.equal([1,2]) because [1,2] !== [1,2]
    expect(childIds.map(x => x.toNumber())).to.eql([childId]);
  });

  it("getRecursiveChildrenIds() should return recursive children ids in DFS order", async () => {
    await noncense.newPost("I'm a father", 0, "", "");
    await noncense.newPost("I'm an uncle", 0, "", "");
    await noncense.newPost("I'm a son", 1, "", "");
    await noncense.newPost("I'm a grandchild", 3, "", "");

    const response = await noncense.getRecursiveChildrenIds(0)
    expect(response.map(x => x.toNumber())).to.eql([1,3,4,2]);
  });
});
