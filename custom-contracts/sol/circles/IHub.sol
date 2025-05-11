// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.28;

import "../hub/IHub.sol";
import "../hub/TypeDefinitions.sol";

interface IHub is IHubV2 {
    /// @notice registers group with Circles hub
    function registerGroup(address policy, string calldata name, string calldata symbol, bytes32 metadataDigest)
        external;
    /// @notice register organization with Circles hub
    function registerOrganization(string calldata name, bytes32 metadataDigest) external;
    /// @notice trust sets the trust of the caller for the receiver with an expiry time.
    function trust(address _trustReceiver, uint96 _expiry) external;
    /// @notice isTrusted returns true if the expiry time of the trust relation is in the future
    function isTrusted(address truster, address trustee) external returns (bool);
    /// @notice Trustmarkers returns (iterator, expiry uint96)
    function trustMarkers(address, address) external returns (TypeDefinitions.TrustMarker memory);
    /// @notice treasuries returns the collateral treasury of the group
    function treasuries(address) external returns (address);
    /// @notice sets advanced usage flags
    function setAdvancedUsageFlag(bytes32 flag) external;
    /// @notice groupMint allows the holder of collateral to directly group mint
    function groupMint(
        address group,
        address[] calldata collateralAvatars,
        uint256[] calldata amounts,
        bytes calldata data
    ) external;
}
