<?php

// Database credentials
$dbHost = "FRI1-SV00134";
$dbUser = "fashishir";
$dbPwd = "YNb0Hn{O7]}}_m6X";
$dbName = "fri1_inventory";

// Function to create a database connection
function createConnection($dbHost, $dbUser, $dbPwd, $dbName) {
    $connectionInfo = array("UID" => $dbUser, "PWD" => $dbPwd, "Database" => $dbName, "CharacterSet" => "UTF-8");
    $conn = sqlsrv_connect($dbHost, $connectionInfo);
    if ($conn === false) {
        die(print_r(sqlsrv_errors(), true));
    }
    return $conn;
}

// Handling CORS
header("Access-Control-Allow-Origin: http://localhost:3500");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Fetch assignedTo from request
$assignedTo = isset($_GET['assignedTo']) ? $_GET['assignedTo'] : null;

if (!$assignedTo) {
    echo json_encode(array("error" => "No assignedTo provided."));
    exit;
}

try {
    // Create the database connection
    $conn = createConnection($dbHost, $dbUser, $dbPwd, $dbName);

    if ($conn) {
        // SQL Query to fetch mobile assignments by assignedTo
        $tsql = "SELECT id, model, imei, serial_number, comment, created_at, assignedTo,signature_data FROM dbo.assignedMobile WHERE assignedTo = ?";
        $params = array($assignedTo);
        $getResults = sqlsrv_query($conn, $tsql, $params);
        if ($getResults === false) {
            echo json_encode(array("error" => "Error in query execution.", "details" => sqlsrv_errors()));
            exit;
        }

        $assignments = array(); // Initialize array to hold all assignments

        // Loop through each row
        while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
            // Add each assignment to the array
            $assignments[] = $row;
        }

        // If no assignments found
        if (empty($assignments)) {
            echo json_encode(array("error" => "No assignments found for the provided assignedTo."));
            exit;
        }

        // Assignments found
        echo json_encode(array("success" => true, "assignments" => $assignments));

        // Free the statement resource
        sqlsrv_free_stmt($getResults);
    } else {
        echo json_encode(array("error" => "Connection could not be established.", "details" => sqlsrv_errors()));
        exit;
    }

    // Close the connection
    sqlsrv_close($conn);
} catch (Exception $e) {
    // Error handling
    echo json_encode(array("error" => "An exception occurred.", "details" => $e->getMessage()));
}


?>
