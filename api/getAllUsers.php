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

try {
    // Create the database connection
    $conn = createConnection($dbHost, $dbUser, $dbPwd, $dbName);

    if ($conn) {
        // SQL Query to fetch all users
        $tsql = "SELECT userID, email, department, created_at FROM dbo.users";
        $getResults = sqlsrv_query($conn, $tsql);
        if ($getResults === false) {
            echo json_encode(array("error" => "Error in query execution.", "details" => sqlsrv_errors()));
            exit;
        }

        $users = [];
        while ($row = sqlsrv_fetch_array($getResults, SQLSRV_FETCH_ASSOC)) {
            $users[] = $row; // Add user to users array
        }

        // If execution is successful
        echo json_encode(array("success" => true, "users" => $users));

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
