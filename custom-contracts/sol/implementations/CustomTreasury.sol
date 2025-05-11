// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.28;

import "../base-group/BaseTreasury.sol";

/**
 * @title CustomTreasury
 * @notice An extended implementation of BaseTreasury with additional features
 * @dev Adds collateral tracking, emergency withdrawal, and ownership functionality
 */
contract CustomTreasury is BaseTreasury {
    // =================================================
    //                     EVENTS
    // =================================================

    event CollateralDeposited(address indexed depositor, uint256 amount);
    event CollateralWithdrawn(address indexed withdrawer, uint256 amount);
    event EmergencyWithdrawal(address indexed recipient, uint256 amount);

    // =================================================
    //                     ERRORS
    // =================================================

    error InsufficientCollateral();
    error WithdrawalFailed();
    error TransferFailed();

    // =================================================
    //                     STORAGE
    // =================================================

    /// @notice Mapping of addresses to their collateral amounts
    mapping(address => uint256) public collateralBalances;

    /// @notice Total collateral held by the treasury
    uint256 public totalCollateral;

    /// @notice Address of the owner
    address public owner;

    // =================================================
    //                  CONSTRUCTOR
    // =================================================

    constructor(
        address _owner,
        address _hub,
        address _nameRegistry,
        address _group,
        string memory _groupName,
        bytes32 _metadataDigest
    ) BaseTreasury(_hub, _nameRegistry, _group, _groupName, _metadataDigest) {
        owner = _owner;
    }

    // =================================================
    //                   MODIFIERS
    // =================================================

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // =================================================
    //                PUBLIC FUNCTIONS
    // =================================================

    /// @notice Deposit collateral into the treasury
    /// @dev Collateral is tracked per depositor
    function depositCollateral() external payable {
        collateralBalances[msg.sender] += msg.value;
        totalCollateral += msg.value;
        emit CollateralDeposited(msg.sender, msg.value);
    }

    /// @notice Withdraw collateral from the treasury
    /// @param _amount Amount of collateral to withdraw
    function withdrawCollateral(uint256 _amount) external {
        if (collateralBalances[msg.sender] < _amount) {
            revert InsufficientCollateral();
        }

        collateralBalances[msg.sender] -= _amount;
        totalCollateral -= _amount;

        (bool success, ) = msg.sender.call{value: _amount}("");
        if (!success) revert WithdrawalFailed();

        emit CollateralWithdrawn(msg.sender, _amount);
    }

    /// @notice Emergency withdrawal of all funds to a specified address
    /// @param _recipient Address to receive the funds
    /// @dev Only callable by owner
    function emergencyWithdraw(address _recipient) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = _recipient.call{value: balance}("");
        if (!success) revert TransferFailed();
        emit EmergencyWithdrawal(_recipient, balance);
    }

    /// @notice Change the owner address
    /// @param _newOwner New owner address
    function setOwner(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }

    /// @notice Get the collateral balance of an address
    /// @param _address Address to check
    /// @return uint256 Collateral balance
    function getCollateralBalance(address _address) external view returns (uint256) {
        return collateralBalances[_address];
    }
}
