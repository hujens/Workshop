pragma solidity ^0.5.0;

//Importing openzeppelin-solidity ERC-721 implemented Standard
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

// StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation
contract TutorialERC721 is ERC721 {

    // Star data
    struct Star {
        string name;
    }

    // Add a name and symbol properties
    string public constant name = "MyPersonalStar";
    string public constant symbol = "MPS";

    // mapping the Star with the Owner Address
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // mapping the TokenId and price
    mapping(uint256 => uint256) public starsForSale;


    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public { // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name); // Star is an struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping
        _mint(msg.sender, _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    // Putting a Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sale the Star you do not own");
        starsForSale[_tokenId] = _price;
    }

    // Function that allows you to convert an address into a payable address
    function _make_payable(address x) internal pure returns (address payable) {
        return address(uint160(x));
    }

    // Function to buy a star
    function buyStar(uint256 _tokenId) public  payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value > starCost, "You need to have enough Ether");
        // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom:
        _transferFrom(ownerAddress, msg.sender, _tokenId);
        // We need to make this conversion to be able to use transfer() function to transfer ethers:
        address payable ownerAddressPayable = _make_payable(ownerAddress);
        ownerAddressPayable.transfer(starCost);
        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }

    // lookUptokenIdToStarInfo to check star information
    function lookUptokenIdToStarInfo (uint _tokenId) public view returns (string memory) {
        //return the Star saved in tokenIdToStarInfo mapping
        return tokenIdToStarInfo[_tokenId].name;
    }

    // Exchange Stars function
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        //Get the owner of the two tokens (ownerOf(_tokenId1), ownerOf(_tokenId1)
        address ownerAddress1 = ownerOf(_tokenId1);
        address ownerAddress2 = ownerOf(_tokenId2);
        //Check if the owner of _tokenId1 or _tokenId2 is the sender
        if (ownerAddress1 != msg.sender) {
            require(ownerAddress2 == msg.sender, "You need to own one of the Stars you want to exchange.");
        } else {
            require(ownerAddress1 == msg.sender, "You need to own one of the Stars you want to exchange.");
        }
        //Use _transferFrom function to exchange the tokens.
        _transferFrom(ownerAddress1, ownerAddress2, _tokenId1);
        _transferFrom(ownerAddress2, ownerAddress1, _tokenId2);
    }

    // Transfer Stars function
    function transferStar(address _to1, uint256 _tokenId) public {
        //Check if the sender is the ownerOf(_tokenId)
        require(ownerOf(_tokenId) == msg.sender, "You need to own the Star you want to transfer.");
        //function to transfer the Star
        _transferFrom(ownerOf(_tokenId), _to1, _tokenId);
    }

}