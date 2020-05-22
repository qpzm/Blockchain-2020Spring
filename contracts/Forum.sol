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

    /**
     * Indices is considered to be sorted in descending order of time.
     * With zero or positive offset, getIds... will return ids of latests posts in descending order.
     * With negative offset, getIds... will return ids in ascending order from oldest post.
     */
    function _getIds(uint[] storage index, uint page, int offset) internal view returns (uint[] memory) {
        page = (page == 0) ? 25 : page;

        uint pos;
        uint size;

        if (offset >= 0) {
            pos = index.length - page * uint(offset) - 1;
            size = (pos + 1 >= page) ? page : pos + 1;
        } else {
            pos = page * (uint(-offset) - 1);
            size = (index.length - pos >= page) ? page : index.length - pos;
        }

        uint[] memory ids = new uint[](size);

        while (size > 0) {
            ids[ids.length - size] = index[pos];
            size -= 1;

            if (offset >= 0) {
                pos -= 1;
            } else {
                pos += 1;
            }
        }

        return ids;
    }

    function getIdsByAuthor(address author, uint page, int offset) public view returns (uint[] memory) {
        return _getIds(byAuthorIndex[author], page, offset);
    }

    function getIdsByParentId(uint id, uint page, int offset) public view returns (uint[] memory) {
        return _getIds(byParentIdIndex[id], page, offset);
    }
}
