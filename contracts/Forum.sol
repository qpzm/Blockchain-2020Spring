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

    function getIdsByAuthor(address author, uint page, int offset) public view returns (uint[] memory) {
        page = (page == 0) ? 50 : page;
        uint returnSize = (byAuthorIndex[author].length < page) ? byAuthorIndex[author].length : page;

        uint[] memory ids = new uint[](returnSize);
        uint j;

        for (uint i = byAuthorIndex[author].length - page * uint(-offset) - 1; i >= 0 && page >= 0; --i) {
            ids[j++] = byAuthorIndex[author][i];
            --page;
            
            // FIXME: workaround fix to strange underflow issue
            if (i <= 0) break;
        }

        return ids;
    }

    function getIdsByParentId(uint id, uint page, int offset) public view returns (uint[] memory) {
        page = (page == 0) ? 50 : page;
        uint returnSize = (byParentIdIndex[id].length < page) ? byParentIdIndex[id].length : page;

        uint[] memory ids = new uint[](returnSize);
        uint j;

        for (uint i = byParentIdIndex[id].length - page * uint(-offset) - 1; i >= 0 && page >= 0; --i) {
            ids[j++] = byParentIdIndex[id][i];
            --page;
            
            // FIXME: workaround fix to strange underflow issue
            if (i <= 0) break;
        }

        return ids;
    }
}
