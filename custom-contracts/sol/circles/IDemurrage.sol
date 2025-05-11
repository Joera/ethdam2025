// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.24;

interface IDemurrage {
    function inflationDayZero() external view returns (uint256);
}
