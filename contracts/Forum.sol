pragma solidity ^0.5.0;

import "github/OpenZeppelin/openzeppelin-contracts/contracts/ownership/Ownable.sol";

contract Forum is Ownable {

    struct postOne {
        address author;

        uint32 last_update;
        uint32 created;

        uint16 children;
        uint16 depth;

        uint parentId;

        string title;
        string body;
        string metadata;
    }

    event NewPost(address indexed author, uint indexed parentId);

    postOne[] public post;
    mapping(address => uint[]) byAuthorIndex;
    mapping(uint => uint[]) byParentIdIndex;

    string private endpoint;

    constructor() public {
        postOne memory p;
        post.push(p);
    }

    function setEndpoint(string memory newEndpoint) onlyOwner public {
        endpoint = newEndpoint;
    }

    function getEndpoint() public view returns (string memory) {
        return endpoint;
    }

    function newPost(string memory body, uint parentId, string memory title, string memory metadata) public {
        postOne memory p;

        p.author = msg.sender;
        p.last_update = uint32(now);
        p.created = uint32(now);
        p.title = title;
        p.body = body;
        p.metadata = metadata;

        require((parentId == 0) || (post[parentId].author != address(0x0)), "parentId doesn't exist");

        post[parentId].children++;
        p.parentId = parentId;
        p.depth = post[parentId].depth + 1;

        require(p.depth <= 3);

        byAuthorIndex[msg.sender].push(post.length);
        byParentIdIndex[parentId].push(post.length);
        post.push(p);

        emit NewPost(msg.sender, parentId);
    }

    function _getIds(uint[] storage index, uint page, uint offset) internal view returns (uint[] memory) {
        page = (page == 0) ? 50 : page;
        uint returnIndex = (index.length > page * offset) ? index.length - page * offset : 0;
        uint returnSize = (returnIndex < page) ? returnIndex : page;

        require(returnSize > 0);

        uint[] memory ids = new uint[](returnSize);
        uint j;

        for (uint i = returnIndex - 1; returnSize > 0; --i) {
            ids[j++] = index[i];
            --returnSize;
        }

        return ids;
    }

    function getIdsByAuthor(address author, uint page, uint offset) public view returns (uint[] memory) {
        return _getIds(byAuthorIndex[author], page, offset);
    }

    function getIdsByParentId(uint id, uint page, uint offset) public view returns (uint[] memory) {
        return _getIds(byParentIdIndex[id], page, offset);
    }
}
