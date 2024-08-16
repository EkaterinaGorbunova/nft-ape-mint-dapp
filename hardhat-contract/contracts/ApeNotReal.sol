//SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/// @dev An ERC721 contract representing ApeNotReal NFTs
contract ApeNotReal is ERC721Enumerable, Ownable {

    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    /// @dev Maximum supply of NFTs
    uint256 public constant MAX_SUPPLY = 10000;

     /// @dev Price of one NFT
    uint256 public constant PRICE = 0.01 ether;

    /// @dev Maximum number of NFTs that can be minted in a single transaction
    uint256 public constant MAX_PER_MINT = 1;

    /// @dev Base URI for token metadata
    string public baseTokenURI;

    constructor(string memory baseURI) ERC721("ApeNotReal", "ANR") {
        setBaseURI(baseURI);
    }  
  
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    /// @dev Sets the base URI for token metadata
    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    // function mintNFTs(uint _count) public payable {
    //     uint totalMinted = _tokenIds.current();
    //   require(totalMinted.add(_count) <= MAX_SUPPLY, "Not enough NFTs!");
    //   require(msg.value >= PRICE.mul(_count), "Not enough ether to purchase NFTs.");
    //   require(_count > 0 && _count <= MAX_PER_MINT, "Cannot mint specified number of NFTs.");
    //     for (uint i = 0; i < _count; i++) {
    //         _mintSingleNFT();
    //     }
    // }

  function mintNFTs(uint256 _count) public payable {
  require(_count > 0, "Mint amount must be greater than zero");
  require(_count <= MAX_PER_MINT, "Mint amount exceeds maximum per mint");
  require(msg.value >= PRICE.mul(_count), "Insufficient funds");
  require(totalSupply().add(_count) <= MAX_SUPPLY, "Exceeds max supply");

  for (uint256 i = 0; i < _count; i++) {
      _mintSingleNFT();
  }
}

    function _mintSingleNFT() private {
        uint256 newTokenID = _tokenIds.current();
        _safeMint(msg.sender, newTokenID);
        _tokenIds.increment();
    }

    /// @dev Returns the token IDs owned by `_owner`
    function tokensOfOwner(address _owner) external view returns (uint256[] memory) {

        uint256 tokenCount = balanceOf(_owner);
        uint256[] memory tokensId = new uint256[](tokenCount);

        for (uint256 i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    /// @dev Withdraws all ETH from the contract
    function withdraw() public payable onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ether left to withdraw");

        (bool success, ) = (msg.sender).call{value: balance}("");
        require(success, "Transfer failed.");
    }

}