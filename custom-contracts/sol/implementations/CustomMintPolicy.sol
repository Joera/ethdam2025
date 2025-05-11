// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../base-group/BaseMintPolicy.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../hub/IHub.sol";
import "./TFGroup.sol";

/**
 * @title CustomMintPolicy
 * @notice An extended implementation of BaseMintPolicy
 * @dev Override base functions to implement custom minting rules
 */
contract CustomMintPolicy is BaseMintPolicy {
    IERC20 public immutable eureToken;
    uint256 private constant DEFAULT_EURE_AMOUNT = 100 * 10**18; // 100 EURE with 18 decimals
    uint256 private constant PAYMENT_PERIOD = 30 days;

    enum MemberStatus {
        NotAMember,      // Never contributed
        Active,          // Up to date with payments
        MissedOne,       // Missed one payment period
        Exited           // Missed more than one payment period
    }

    // Struct to store mint information
    struct MintInfo {
        address group;
        uint256 blockTimestamp;
        uint256 amount;
    }

    // Struct to store contributor rotation info
    struct RotationInfo {
        address contributor;
        uint256 firstMintTime;
        uint256 lastPaymentTime;  // Track last payment for status checks
    }

    mapping(address => MintInfo[]) public contributorHistory;
    
    // Mapping to track if an address has already contributed (to avoid duplicates in rotation)
    mapping(address => bool) private hasContributed;
    // Array to maintain rotation schedule ordered by first contribution time
    RotationInfo[] public rotationSchedule;

    // Track payment periods for each member
    mapping(address => uint256) private lastPaymentTime;

    // Track member status explicitly
    mapping(address => MemberStatus) private memberStatus;

    // Event for status changes
    event MemberStatusChanged(address indexed member, MemberStatus status);

    constructor(address _eureTokenAddress) {
        eureToken = IERC20(_eureTokenAddress);
    }

    /**
     * @notice Get the current status of a member
     * @param _member Address of the member to check
     * @return MemberStatus Current status of the member
     */
    function getMemberStatus(address _member) public view returns (MemberStatus) {
        if (!hasContributed[_member]) {
            return MemberStatus.NotAMember;
        }

        // Get current stored status
        MemberStatus currentStatus = memberStatus[_member];
        
        // If not active, return current status
        if (currentStatus != MemberStatus.Active) {
            return currentStatus;
        }

        // For active members, check if they're still within payment period
        uint256 lastPayment = lastPaymentTime[_member];
        if (lastPayment == 0) {
            lastPayment = block.timestamp; // New member gets grace period
        }

        uint256 timeSincePayment = block.timestamp - lastPayment;
        
        if (timeSincePayment <= PAYMENT_PERIOD) {
            return MemberStatus.Active;
        } else if (timeSincePayment <= 2 * PAYMENT_PERIOD) {
            return MemberStatus.MissedOne;
        } else {
            return MemberStatus.Exited;
        } 
    }

    /**
     * @notice Override of beforeMintPolicy to implement custom mint rules
     * Requires the minter to transfer EURE to the group treasury
     * @param _minter Address of the minter
     * @param _group Address of the group
     * @param _collateral Array of collateral token addresses
     * @param _amounts Array of amounts to mint for each collateral
     * @param _data ABI encoded uint256 representing the contribution amount in EURE (with 18 decimals)
     */
    function beforeMintPolicy(
        address _minter,
        address _group,
        uint256[] calldata _collateral,
        uint256[] calldata _amounts,
        bytes calldata _data
    ) external virtual override returns (bool) {
        
        // Get the contribution amount from data, or use default if not provided
        uint256 contributionAmount = _data.length > 0 ? 
            abi.decode(_data, (uint256)) : 
            DEFAULT_EURE_AMOUNT;

        // Add deposit for first-time contributors
        if (!hasContributed[_minter]) {
            contributionAmount = contributionAmount * 2;
        }
        
        // Get the group's treasury from the TFGroup contract
        address treasury = address(TFGroup(_group).BASE_TREASURY());
        
        // Transfer EURE from minter to treasury
        require(
            eureToken.transferFrom(_minter, treasury, contributionAmount),
            "EURE transfer failed"
        );

        // Update payment tracking
        lastPaymentTime[_minter] = block.timestamp;

        // Set member status to Active
        memberStatus[_minter] = MemberStatus.Active;
        emit MemberStatusChanged(_minter, MemberStatus.Active);

        // Keep record of who has paid and when
        contributorHistory[_minter].push(MintInfo({
            group: _group,
            blockTimestamp: block.timestamp,
            amount: 1 
        }));

        // Add to rotation schedule if first time contributor
        if (!hasContributed[_minter]) {
            hasContributed[_minter] = true;
            rotationSchedule.push(RotationInfo({
                contributor: _minter,
                firstMintTime: block.timestamp,
                lastPaymentTime: block.timestamp
            }));
        } else {
            // Update last payment time in rotation schedule
            for (uint i = 0; i < rotationSchedule.length; i++) {
                if (rotationSchedule[i].contributor == _minter) {
                    rotationSchedule[i].lastPaymentTime = block.timestamp;
                    break;
                }
            }
        }

        return true;
    }

    /**
     * @notice Get the complete rotation schedule
     * @return RotationInfo[] Array of contributors ordered by their first mint time
     */
    function getRotationSchedule() external view returns (RotationInfo[] memory) {
        return rotationSchedule;
    }

    /**
     * @notice Get the number of unique contributors
     * @return uint256 Number of unique contributors
     */
    function getUniqueContributorCount() external view returns (uint256) {
        return rotationSchedule.length;
    }

    /**
     * @notice Check if an address has ever contributed
     * @param _contributor Address to check
     * @return bool True if the address has contributed
     */
    function isContributor(address _contributor) external view returns (bool) {
        return hasContributed[_contributor];
    }

    /**
     * @notice Get all mints by a specific minter
     * @param _minter Address of the minter
     * @return MintInfo[] Array of mint information
     */
    function getContributorHistory(address _minter) external view returns (MintInfo[] memory) {
        return contributorHistory[_minter];
    }

    /**
     * @notice Get the current recipient (first in rotation schedule)
     * @return address Current recipient's address
     */
    function getCurrentRecipient() external view returns (address) {
        require(rotationSchedule.length > 0, "No contributors in rotation");
        return rotationSchedule[0].contributor;
    }

    /**
     * @notice Rotate the schedule by moving first contributor to the end
     * @dev Only callable by the group contract
     */
    function rotateSchedule() external returns (bool) {
        require(rotationSchedule.length > 0, "No contributors in rotation");
        require(msg.sender == address(TFGroup(msg.sender)), "Only group can rotate");
        
        // Move first contributor to end
        RotationInfo memory first = rotationSchedule[0];
        
        // Shift everyone else forward
        for (uint i = 0; i < rotationSchedule.length - 1; i++) {
            rotationSchedule[i] = rotationSchedule[i + 1];
        }
        
        // Put first at the end
        rotationSchedule[rotationSchedule.length - 1] = first;
        
        return true;
    }

    /**
     * @notice Override of beforeBurnPolicy to implement custom burn rules
     */
    function beforeBurnPolicy(
        address /*_burner*/,
        address /*_group*/,
        uint256 /*_amount*/,
        bytes calldata /*_data*/
    ) external virtual override returns (bool) {
        // Add custom burning rules here
        return true;
    }
}
