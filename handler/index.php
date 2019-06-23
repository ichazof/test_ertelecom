<?php
define('CLASS_DIR', 'src');
// error_reporting(0);

include "Psr4AutoloaderClass.php";
$loader = new Psr4AutoloaderClass;
$loader->register();
$loader->addNamespace('Workers', __DIR__ . DIRECTORY_SEPARATOR . CLASS_DIR);

use Workers\Workers;

$_POST = json_decode(file_get_contents('php://input'), true);
$worker = new Workers();
switch ($_POST["method"]) {
    case "create":
        $worker->create($_POST["data"]);
        break;
    case "delete":
        $worker->delete($_POST["data"]);
        break;
    case "get":
        $worker->get();
        break;
    case "edit":
        $worker->edit($_POST["data"]);
        break;
}

