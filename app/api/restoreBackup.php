<?php
    $_POST = json_decode(file_get_contents("php://input"), true);

    $file = $_POST["file"];
    $page = $_POST["page"];


    if($page && $file){
        $backupFileName = uniqid() . ".html";
        copy("../backups/" . $file, "../../" . $page); // create backup of file
    } else {
        header("HTTP/1.0 400 Bad Request");
    }