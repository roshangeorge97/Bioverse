// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract ScheduledPayments is AutomationCompatibleInterface {
    struct Payment {
        address recipient;
        uint256 amount;
        uint256 interval;
        uint256 lastPaymentTimestamp;
        bool isActive;
    }

    mapping(address => Payment[]) public userPayments;

    event PaymentScheduled(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        uint256 interval
    );
    event PaymentSent(
        address indexed sender,
        address indexed recipient,
        uint256 amount
    );
    event PaymentCancelled(address indexed sender, uint256 paymentIndex);

    // New variable for testing
    uint256 public testTimestamp;

    constructor() {
        testTimestamp = block.timestamp;
    }

    function schedulePayment(
        address _recipient,
        uint256 _amount,
        uint256 _interval
    ) external payable {
        require(_recipient != address(0), "Invalid recipient address");
        require(_amount > 0, "Amount must be greater than 0");
        require(_interval > 0, "Interval must be greater than 0");
        require(msg.value >= _amount, "Insufficient funds sent");

        Payment memory newPayment = Payment({
            recipient: _recipient,
            amount: _amount,
            interval: _interval,
            lastPaymentTimestamp: testTimestamp, // Use testTimestamp instead of block.timestamp
            isActive: true
        });

        userPayments[msg.sender].push(newPayment);

        emit PaymentScheduled(msg.sender, _recipient, _amount, _interval);
    }

    function cancelPayment(uint256 _paymentIndex) external {
        require(
            _paymentIndex < userPayments[msg.sender].length,
            "Invalid payment index"
        );
        require(
            userPayments[msg.sender][_paymentIndex].isActive,
            "Payment already cancelled"
        );

        userPayments[msg.sender][_paymentIndex].isActive = false;

        emit PaymentCancelled(msg.sender, _paymentIndex);
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        address[] memory usersToProcess = new address[](1);
        uint256[] memory paymentIndexes = new uint256[](1);
        uint256 count = 0;

        for (uint256 u = 0; u < 10; u++) {
            // Limit to checking 10 users for gas efficiency
            address user = address(uint160(u)); // Simple way to generate addresses for testing
            for (uint256 i = 0; i < userPayments[user].length; i++) {
                Payment memory payment = userPayments[user][i];
                if (
                    payment.isActive &&
                    (testTimestamp - payment.lastPaymentTimestamp) >=
                    payment.interval
                ) {
                    usersToProcess[count] = user;
                    paymentIndexes[count] = i;
                    count++;
                    return (
                        true,
                        abi.encode(usersToProcess, paymentIndexes, count)
                    );
                }
            }
        }
        return (false, "");
    }

    function performUpkeep(bytes calldata performData) external override {
        (
            address[] memory users,
            uint256[] memory paymentIndexes,
            uint256 count
        ) = abi.decode(performData, (address[], uint256[], uint256));

        for (uint256 i = 0; i < count; i++) {
            address user = users[i];
            uint256 paymentIndex = paymentIndexes[i];
            Payment storage payment = userPayments[user][paymentIndex];

            require(payment.isActive, "Payment is not active");
            require(
                (testTimestamp - payment.lastPaymentTimestamp) >=
                    payment.interval,
                "Payment interval not reached"
            );

            payment.lastPaymentTimestamp = testTimestamp;

            (bool success, ) = payment.recipient.call{value: payment.amount}(
                ""
            );
            require(success, "Payment failed");

            emit PaymentSent(user, payment.recipient, payment.amount);
        }
    }

    function getUserPayments(
        address user
    ) external view returns (Payment[] memory) {
        return userPayments[user];
    }

    // Function to manually trigger checkUpkeep for testing
    function manualCheckUpkeep()
        external
        view
        returns (bool upkeepNeeded, bytes memory performData)
    {
        return this.checkUpkeep("");
    }

    // Function to manually trigger performUpkeep for testing
    function manualPerformUpkeep(bytes calldata performData) external {
        this.performUpkeep(performData);
    }

    // Function to advance time for testing
    function advanceTime(uint256 secnds) external {
        testTimestamp += secnds;
    }

    receive() external payable {}
}
