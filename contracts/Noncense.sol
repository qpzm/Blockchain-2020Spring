pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract Noncense is Ownable {

    struct postOne {
        address author;     // 20
        bool isImmutable;   //  1

        uint64 created;     //  8
        uint64 last_update; //  8

        uint64 depth;       //  8
        uint children;      // 32
        uint parentId;      // 32

        string title;
        string body;
        string metadata;
    }

    event PostUpdated(address indexed author, uint indexed id, uint indexed parentId);

    postOne[] public post;
    mapping(address => uint[]) byAuthorIndex;
    mapping(uint => uint[]) byParentIdIndex;

    mapping(address => string) public endpoint;

    constructor() public {
        postOne memory p;
        post.push(p);
    }

    function setEndpoint(string memory newEndpoint) public {
        endpoint[msg.sender] = newEndpoint;
    }

    function defaultEndpoint() public view returns (string memory) {
        return endpoint[owner()];
    }

    function newPost(string memory body, uint parentId, string memory title, string memory metadata, bool isImmutable) public {
        require((parentId == 0) || (post[parentId].author != address(0x0)), "parentId doesn't exist");

        postOne memory p;

        p.author = msg.sender;
        p.created = uint64(now);
        p.last_update = uint64(now);

        p.title = title;
        p.body = body;
        p.metadata = metadata;

        p.isImmutable = isImmutable;

        post[parentId].children++;
        p.parentId = parentId;
        p.depth = post[parentId].depth + 1;

        byAuthorIndex[msg.sender].push(post.length);
        byParentIdIndex[parentId].push(post.length);
        post.push(p);

        emit PostUpdated(msg.sender, post.length-1, parentId);
    }

    function updatePost(uint id, string memory body, string memory title, string memory metadata) public {
        postOne storage p = post[id];

        require(p.author == msg.sender, "Only author can update post");
        require(!p.isImmutable || (bytes(title).length == 0 && bytes(body).length == 0));

        p.title = title;
        p.body = body;
        p.metadata = metadata;
        p.last_update = uint64(now);

        emit PostUpdated(msg.sender, id, p.parentId);
    }

    function setImmutable(uint id) public {
        postOne storage p = post[id];

        require(p.author == msg.sender, "Only author can make post immutable");
        require(!p.isImmutable);

        p.isImmutable = true;
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
