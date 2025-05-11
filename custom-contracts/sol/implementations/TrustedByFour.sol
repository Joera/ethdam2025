// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.28;

import "../circles/Core.sol";
import "../membership-conditions/IMembershipCondition.sol";
import { TFGroup } from "./TFGroup.sol";

/// @title isHuman membership condition
/// @notice A membership condition that checks if the given avatar is registered as human in Circles hub
contract IsHumanAtLeastFourTrustsCondition is CirclesCoreAddresses, IMembershipCondition {
    // State

    /// @notice core Circles protocol addresses
    CirclesCore public circlesCore;

    // Constructor

    constructor(CirclesCore memory _circlesCore) {
        circlesCore = _circlesCore;
    }

    function passesMembershipCondition(address _avatar) external view returns (bool) {
        // Get sponsors from TFGroup's trusted avatars
        address[] memory sponsors = TFGroup(msg.sender).getTrustedAvatars();
        // Only apply this condition when there are at least 4 sponsors
        if (sponsors.length < 4) {
            return true;  // Skip this condition if not enough sponsors
        }
        uint256 count = 0;
        for (uint256 i = 0; i < sponsors.length; i++) {
            if (circlesCore.hub.isTrusted(sponsors[i], _avatar)) {
                count++;
                if (count >= 4) return true;
            }
        }
        return false;
    }
}
