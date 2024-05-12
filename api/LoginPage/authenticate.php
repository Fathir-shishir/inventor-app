<?php
session_start();

// Specify the allowed origin for your frontend application
$allowed_origin = 'http://localhost:3500';

header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once("../functions.php");

try {
    // Create the database connection
    $conn = createConnection();

    // Handle preflight requests for CORS
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        // Respond to preflight request with necessary headers
        header("Access-Control-Allow-Methods: POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type");
        exit(0);
    }

    // Query the user
    $stmt = checkStmt(
        $conn,
        "SELECT id, IIF(firstname = lastname, firstname, CONCAT(firstname, ' ', lastname)) AS [name] FROM common.dbo.users WHERE username = ? AND [password] = ?",
        array($_POST["username"], $_POST["password"])
    );

    // Initialize an array to hold your data
    $data = array();

    if (sqlsrv_has_rows($stmt)) {
        // The user exists

        // Fetch the data
        $user_data = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC);
        $data["name"] = $user_data["name"];

        sqlsrv_free_stmt($stmt);

    } else {
        sqlsrv_free_stmt($stmt);
        // User does not exist
        throw new Exception("The user does not exist (" . $_POST["username"] . ")", 0);
    }

    // Get the APU name and other details as before...
    // ...

    // Response
    echo json_encode(array("errors" => 0, "data" => $data));
} catch (Exception $e) {
    logError($e);
    echo getErrorResponse($e);
} finally {
    sqlsrv_close($conn);
}
