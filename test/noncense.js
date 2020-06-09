const Noncense = artifacts.require("./Noncense");

let noncense;
contract("Noncense", accounts => {
  // Noncense.deployed() uses the same deployed contract in a file, which results in dependency between tests.
  // Noncense.new() resets the contract each it block.
  beforeEach(async () => { noncense = await Noncense.new() });

  it("newPost() should create new post with given contents", async () => {
    await noncense.newPost("Hello Noncense", 0, "", "", false);

    const post = await noncense.post.call(1);
    expect(post.body).to.equal("Hello Noncense");
  });

  it("getIdsByAuthor() should return post ids written by the author", async () => {
    // accounts[0] is the default msg.sender who wrote the root post, so use another one.
    const author = accounts[1];
    await noncense.newPost("", 0, "", "", false, { from: author });
    const postId = 1
    const postIds = await noncense.getIdsByAuthor(author, 0, 0)

    expect(postIds.map(x => x.toNumber())).to.eql([postId]);
  });

  it("getIdsByParentId() should return its children ids", async () => {
    await noncense.newPost("I'm the parent post!", 0, "", "", false);
    const parentId = 1

    await noncense.newPost("I'm the most recent post!", parentId, "", "", false);
    const childId = 2
    const childIds = await noncense.getIdsByParentId(parentId, 0, 0)

    // eql checks deep equality but equal checks strict equality.
    // e.g. expect([1, 2]).not.to.equal([1,2]) because [1,2] !== [1,2]
    expect(childIds.map(x => x.toNumber())).to.eql([childId]);
  });

  it("updatePost() should be executed if the post is not immutable", async () => {
    await noncense.newPost("Not immutable post", 0, "", "", false);
    const postId = 1

    await noncense.updatePost(postId, "Updated post", "", "");

    const updatedPost = await noncense.post.call(postId);
    expect(updatedPost.body).to.equal("Updated post");
  });

  it("updatePost() should NOT be executed if the post is immutable", async () => {
    await noncense.newPost("Immutable post", 0, "", "", true);
    const postId = 1

    try {
      await noncense.updatePost(postId, "Updated post", "", "");
      assert.fail("The transaction should have thrown an error");
    }
    catch (err) {
        assert.include(err.message, "revert", "The error message should contain 'revert'");
    }
  });
});
