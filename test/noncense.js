const Noncense = artifacts.require("./Noncense");

contract("Noncense", accounts => {

  it("newPost() should create new post with given contents", async () => {
    const noncense = await Noncense.deployed();

    await noncense.newPost("Hello Noncense", 0, "", "");

    const post = await noncense.post.call(1);
    assert.equal(post.body, "Hello Noncense");
  });

});
