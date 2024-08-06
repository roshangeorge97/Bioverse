// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserProfileManager {
    struct Profile {
        string name;
        string role;
        string twitter;
        string linkedIn;
        string github;
    }

    mapping(string => bool) public userNameRegistered;
    mapping(string => address[]) public userAddresses;
    mapping(string => address) public primaryAddress;
    mapping(string => Profile) public profiles;

    event ProfileCreated(string indexed name, address primaryAddress);
    event ProfileUpdated(string indexed name);
    event AddressAdded(string indexed name, address newAddress);
    event FundsSent(string indexed name, address from, uint256 amount);

    function createProfile(
        string memory _name,
        address _primaryAddress,
        string memory _role,
        string memory _twitter,
        string memory _linkedIn,
        string memory _github
    ) public {
        require(!userNameRegistered[_name], "Profile already exists");

        userNameRegistered[_name] = true;
        primaryAddress[_name] = _primaryAddress;
        profiles[_name] = Profile(_name, _role, _twitter, _linkedIn, _github);
        userAddresses[_name].push(_primaryAddress);

        emit ProfileCreated(_name, _primaryAddress);
    }

    function updateProfile(
        string memory _name,
        string memory _role,
        string memory _twitter,
        string memory _linkedIn,
        string memory _github
    ) public {
        require(userNameRegistered[_name], "Profile does not exist");

        profiles[_name] = Profile(_name, _role, _twitter, _linkedIn, _github);

        emit ProfileUpdated(_name);
    }

    function addAddress(string memory _name, address _newAddress) public {
        require(userNameRegistered[_name], "Profile does not exist");
        require(primaryAddress[_name] != _newAddress, "Address already associated with the profile");

        userAddresses[_name].push(_newAddress);
        profiles[_name] = profiles[_name];

        emit AddressAdded(_name, _newAddress);
    }

    function getProfile(string memory _name) public view returns (Profile memory) {
        require(userNameRegistered[_name], "Profile does not exist");
        return profiles[_name];
    }

    function getAddresses(string memory _name) public view returns (address[] memory) {
        require(userNameRegistered[_name], "Profile does not exist");
        return userAddresses[_name];
    }

    function sendFunds(string memory _name) public payable {
        address recipient = primaryAddress[_name];
        require(userNameRegistered[_name], "Profile does not exist");
        require(recipient != address(0), "Primary address is not set");
        require(msg.value > 0, "Amount must be greater than 0");

        payable(recipient).transfer(msg.value);

        emit FundsSent(_name, msg.sender, msg.value);
    }
}
