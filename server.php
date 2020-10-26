<?php
$_POST = json_decode(file_get_contents("php://input"), true); // чтобы получить json на php коде
echo var_dump($_POST);