// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Bioverse {
    // Event to log payments
    event PaymentSent(
        address indexed from,
        address indexed to,
        uint256 amount,
        string message
    );

    // Function to send payments
    function sendPayment(
        address payable _to,
        string memory _message
    ) external payable {
        require(msg.value > 0, "Payment must be greater than 0");

        // Transfer the amount to the recipient
        _to.transfer(msg.value);

        // Emit the payment event
        emit PaymentSent(msg.sender, _to, msg.value, _message);
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
