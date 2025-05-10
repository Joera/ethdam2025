// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.28;

import "../../circles-groups/src/base-group/BaseTreasury.sol";

/**
 * @title CustomTreasury
 * @notice An extended implementation of BaseTreasury with additional features
 * @dev Adds collateral tracking, emergency withdrawal, and ownership functionality
 */
contract CustomTreasury is BaseTreasury {
    // =================================================
    //                     EVENTS
    // =================================================
    event CollateralTracked(uint256 indexed tokenId, uint256 amount);

    // =================================================
    //                     ERRORS
    // =================================================
    error InvalidAmount();

    // =================================================
    //                  STATE VARIABLES
    // =================================================
    
    // Mapping to track collateral balances by token ID
    mapping(uint256 => uint256) public collateralBalances;
    

    /**
     * @notice Constructor to initialize the CustomTreasury
     * @param hub The address of the Circles Hub contract
     * @param nameRegistry The address of the name registry contract
     * @param group The address of the associated group
     */
    constructor(
        IHub hub,
        INameRegistry nameRegistry,
        address group
    ) BaseTreasury(hub, nameRegistry, group) {}

    /**
     * @notice Override of onERC1155Received to add collateral tracking
     * @dev Adds balance tracking on top of base implementation
     */
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) public virtual override returns (bytes4) {
        // Call parent implementation first
        bytes4 result = super.onERC1155Received(operator, from, id, amount, data);
        
        // Track the collateral
        _trackCollateral(id, amount);
        
        return result;
    }

    /**
     * @notice Override of onERC1155BatchReceived to add collateral tracking
     * @dev Adds balance tracking on top of base implementation
     */
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) public virtual override returns (bytes4) {
        // Call parent implementation first
        bytes4 result = super.onERC1155BatchReceived(operator, from, ids, amounts, data);
        
        // Track all collateral
        for (uint256 i = 0; i < ids.length; i++) {
            _trackCollateral(ids[i], amounts[i]);
        }
        
        return result;
    }

    /**
     * @notice Internal function to track collateral balances
     * @param tokenId The ID of the token to track
     * @param amount The amount to add to tracking
     */
    function _trackCollateral(uint256 tokenId, uint256 amount) internal {
        collateralBalances[tokenId] += amount;
        emit CollateralTracked(tokenId, amount);
    }

    /**
     * @notice View function to get collateral balance for a token
     * @param tokenId The ID of the token to check
     * @return The balance of the specified token
     */
    function getCollateralBalance(uint256 tokenId) external view returns (uint256) {
        return collateralBalances[tokenId];
    }
}
