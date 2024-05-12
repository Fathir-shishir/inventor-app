<?php
session_start();

$allowed_origin = 'http://localhost:3500';

// Set headers for CORS
header("Access-Control-Allow-Origin: $allowed_origin");
header("Access-Control-Allow-Credentials: true"); // Allow cookies and authorization headers with credentials
header("Content-Type: application/json"); // Set the content type to application/json

// Handle preflight requests for CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    // Allow only POST and OPTIONS methods
    header("Access-Control-Allow-Methods: POST, OPTIONS"); 
    // Ensure Content-Type is allowed
    header("Access-Control-Allow-Headers: Content-Type, X-Requested-With"); 
    // Respond with OK status and exit
    header("HTTP/1.1 204 No Content");
    exit;
}

// Destroy the session
// Unset all of the session variables
$_SESSION = array();

// If it's desired to kill the session, also delete the session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finally, destroy the session
session_destroy();

// Return a JSON response indicating logout was successful
echo json_encode(true);
?>
