<?php

class NoWorkorderException extends Exception {
    // Define the constructor to accept the lineId and construct the message internally
    public function __construct($lineId, $code = 0, Throwable $previous = null) {
        $message = "No work order found! There is no booking for this line (ID: $lineId) in the last 24 hours.";
        // Call the parent constructor with the full message and the code
        parent::__construct($message, $code, $previous);
    }
}

class NoCycleTimeException extends Exception {
    // Define the constructor to accept the lineId and construct the message internally
    public function __construct($partNumber, $lineId, $code = 0, Throwable $previous = null) {
        $message = "No cycle time defined for the part number: " . $partNumber . ", for the line with the ID: " . $lineId . ".";
        // Call the parent constructor with the full message and the code
        parent::__construct($message, $code, $previous);
    }
}