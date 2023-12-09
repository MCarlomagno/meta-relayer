// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract MetaRelayer is AccessControl {
  bytes32 public constant RELAYER = keccak256("RELAYER");
  uint _baseFunds;

  constructor(address[] memory relayers, uint baseFunds) payable {
    _baseFunds = baseFunds;

    uint relayersLength = relayers.length;

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

    for (uint i = 0; i < relayersLength; i++) {
      // fund relayers
      (bool success,) = relayers[i].call{value: msg.value / relayersLength}("");

      // allow relayers only
      _grantRole(RELAYER, relayers[i]);
    }
  }

  function send(address target, bytes calldata data) external payable onlyRole(RELAYER) returns(bool) {
    // forwards the tx to target
    (bool success,) = target.call{value: msg.value}(data);

    // if relayer is getting out of funds send some eth.
    if (msg.sender.balance < _baseFunds) {
      (bool sent,) = msg.sender.call{value: _baseFunds}("");
    }

    return success;
  }

  function sendBatch(address[] memory targets, bytes[] calldata data, uint[] memory values) external payable onlyRole(RELAYER) returns(bool[] memory) {
    uint targetsLength = targets.length;
    uint dataLength = data.length;
    uint valuesLength = values.length;
    require(targetsLength == dataLength, "MetaRelayer: targets and data length mismatch");
    require(targetsLength == valuesLength, "MetaRelayer: targets and values length mismatch");

    bool[] memory results = new bool[](targetsLength);

    // forwards the txs to target
    for (uint i = 0; i < targetsLength; i++) {
      (bool success,) = targets[i].call{value: values[i]}(data[i]);

      results[i] = success;
    }

    // if relayer is getting out of funds send some eth.
    if (msg.sender.balance < _baseFunds) {
      (bool sent,) = msg.sender.call{value: _baseFunds}("");
    }

    return results;
  }
}