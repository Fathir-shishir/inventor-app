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

// Handling preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    exit(0);
}

try {
    $conn = createConnection($dbHost, $dbUser, $dbPwd, $dbName);

    if ($conn) {
        // Retrieve assignment data from the database using the assignment ID
        $sql = "SELECT * FROM dbo.scrapedMobile";
        $stmt = sqlsrv_query($conn, $sql);

        if ($stmt === false) {
            echo json_encode(["error" => "Error fetching assignment data.", "details" => sqlsrv_errors()]);
            exit;
        }

        $allData = array(); // Initialize an array to store all rows

        while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
            // Add each row to the array
            $allData[] = $row;
        }

        if (!empty($allData)) {
            echo json_encode($allData);
        } else {
            echo json_encode(["error" => "No data found in the 'scrapedMobile' table."]);
        }
    } else {
        echo json_encode(["error" => "Connection could not be established.", "details" => sqlsrv_errors()]);
        exit;
    }

    sqlsrv_close($conn);

} catch (Exception $e) {
    echo json_encode(["error" => "An exception occurred.", "details" => $e->getMessage()]);
}
?>
