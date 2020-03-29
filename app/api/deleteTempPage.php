<?php

    $file = "../../iwoc3fh38_09fksd.html";

    if(file_exists($file)){
        unlink($file);
    } else {
        header("HTTP/1.0 400 Bad Request");
    }