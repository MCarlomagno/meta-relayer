// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Counter {
    uint256 number = 10;

    function increase() public returns (uint256) {
        number++;
        return number;
    }

    function setNumber(uint256 value) public returns (uint256) {
        number = value;
        return number;
    }

    function sumNumbers(uint256[] memory values) public returns (uint256) {
        for (uint i = 0; i < values.length; i++) {
            number += values[i];
        }
        return number;
    }
}