<?php

// SEE:
//    o http://www.jsonrpc.org/specification
//    o http://www.simple-is-better.org/json-rpc/transport_http.html
//    o https://www.bram.us/2014/10/26/php-5-6-automatically-populating-http_raw_post_data-is-deprecated-and-will-be-removed-in-a-future-version/

require __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

use JsonRPC\Server;

$server = new Server();

$server->register('login', function($id, $password, $rememberMe) {
    return "ok";
});

echo $server->execute();

