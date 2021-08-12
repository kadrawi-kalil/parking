pragma solidity ^0.5.0;

contract Decentragram {
  string public name;
  uint public placeCount = 0;
  address public owner;
  mapping(uint => Place) public places;

  struct Place {
    uint id;
    string hash;
    string description;
    string date;
    string time;
    string nbHour;
    uint tipAmount;
    address payable author;
  }

  event PlaceCreated(
    uint id,
    string hash,
    string description,
    string date,
    string time,
    string nbHour,
    uint tipAmount,
    address payable author
  );

  event PlaceTipped(
    uint id,
    string hash,
    string description,
    string date,
    string time,
    string nbHour,
    uint tipAmount,
    address payable author
  );

  constructor() public {
    name = "Parking";
    owner = msg.sender;
  }

  function uploadPlace(string memory _imgHash, string memory _description,
  string memory _date,string memory _time,string memory _nbHour
  ) public {
    // Make sure the place hash exists
    require(bytes(_imgHash).length > 0);
    // Make sure place description exists
    require(bytes(_description).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));

    // Increment place id
    placeCount ++;

    // Add Place to the contract
    places[placeCount] = Place(placeCount, _imgHash, _description,_date,_time,_nbHour, 0, msg.sender);
    // Trigger an event
    emit PlaceCreated(placeCount, _imgHash, _description,_date,_time,_nbHour, 0, msg.sender);
  }

  function tipPlaceOwner(uint _id) public payable {
    // Make sure the id is valid
    require(_id > 0 && _id <= placeCount);
    // Fetch the place
    Place memory _place = places[_id];
    // Fetch the author
    address payable _author = _place.author;
    // Pay the author by sending them Ether
    address(_author).transfer(msg.value);
    // Increment the tip amount
    _place.tipAmount = _place.tipAmount + msg.value;
    // Update the place
    places[_id] = _place;
    // Trigger an event
    emit PlaceTipped(_id, _place.hash, _place.description, _place.date, _place.time,  _place.nbHour, _place.tipAmount, _author);
  }
}
