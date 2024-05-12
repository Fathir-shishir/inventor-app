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
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    exit(0);
}

try {
    // Create the database connection
    $connInventory = createConnection($dbHost, $dbUser, $dbPwd, $dbName);

    if ($connInventory) {
        // Collect data from request
        $postData = json_decode(file_get_contents('php://input'), true);
        $model = $postData['model'] ?? '';
        $quantities = isset($postData['quantities']) ? (int)$postData['quantities'] : 0;
        $mobileHistory = $postData['mobileHistory'] ?? '';
        $condition = $postData['condition'] ?? '';

        // Prepare date from backend
        $mobileUpdateDate = date('Y-m-d');

        // SQL Query to insert data into dbo.mobiles
        $tsqlMobiles = "INSERT INTO dbo.mobiles (model, quantities, mobileUpdateDate, mobileHistory,condition) 
                        VALUES (?, ?, ?, ?, ?)";
        $paramsMobiles = array(&$model, &$quantities, &$mobileUpdateDate, &$mobileHistory, &$condition);
        $stmtMobiles = sqlsrv_prepare($connInventory, $tsqlMobiles, $paramsMobiles);

        // Execute the query for dbo.mobiles
        if (!sqlsrv_execute($stmtMobiles)) {
            echo json_encode(array("error" => "Error in dbo.mobiles table statement execution.", "details" => sqlsrv_errors()));
            exit;
        }

        // Check if model exists in dbo.mobileQuantities
        $sqlCheckModel = "SELECT id, totalQuantities FROM dbo.mobileQuantities WHERE model = ? AND condition = ?";
        $paramsCheckModel = array(&$model,&$condition);
        $stmtCheckModel = sqlsrv_query($connInventory, $sqlCheckModel, $paramsCheckModel);

        if ($stmtCheckModel === false) {
            echo json_encode(array("error" => "Error checking dbo.mobileQuantities.", "details" => sqlsrv_errors()));
            exit;
        }

        $row = sqlsrv_fetch_array($stmtCheckModel, SQLSRV_FETCH_ASSOC);

        if ($row) {
            // Model exists, update the quantity
            $newTotalQuantities = $row['totalQuantities'] + $quantities;
            $sqlUpdateQuantities = "UPDATE dbo.mobileQuantities SET totalQuantities = ? WHERE model = ? AND condition = ?";
            $paramsUpdateQuantities = array(&$newTotalQuantities, &$model, &$condition);
        } else {
            // Model does not exist, insert new row
            $sqlUpdateQuantities = "INSERT INTO dbo.mobileQuantities (model, totalQuantities, condition) VALUES (?, ?, ?)";
            $paramsUpdateQuantities = array(&$model, &$quantities, &$condition);
        }

        $stmtUpdateQuantities = sqlsrv_query($connInventory, $sqlUpdateQuantities, $paramsUpdateQuantities);

        if ($stmtUpdateQuantities === false) {
            echo json_encode(array("error" => "Error updating/inserting dbo.mobileQuantities.", "details" => sqlsrv_errors()));
            exit;
        }

        // If execution is successful
        echo json_encode(array("success" => "Data successfully inserted/updated in both tables."));

        // Free the statement resources
        sqlsrv_free_stmt($stmtMobiles);
        sqlsrv_free_stmt($stmtCheckModel);
        // Note: No need to free $stmtUpdateQuantities as it's not prepared but directly executed

    } else {
        echo json_encode(array("error" => "Connection could not be established.", "details" => sqlsrv_errors()));
        exit;
    }

    // Close the connection
    sqlsrv_close($connInventory);

} catch (Exception $e) {
    echo json_encode(array("error" => "An exception occurred.", "details" => $e->getMessage()));
}

?>
