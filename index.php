<?php

header('Content-Type: text/html; charset=utf-8');
header('Content-Type: text/plain; charset=utf-8');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept,Authorization");



use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

require_once "vendor/autoload.php";


use OnHold\Users\UserManager;
use OnHold\Users\Address\UserAddressManager;
use OnHold\Posts\PostManager;
use OnHold\Posts\PostImagesManager;
use OnHold\Posts\Storage\StorageManager;
use OnHold\Posts\Address\PostAddressManager;
use OnHold\Orders\OrdersManager;
use OnHold\Roles\RolesManager;
use OnHold\Slots\SlotsManager;

$app = new \Slim\App();

////////////////// CONTAINERS ////////////////////

$app->getContainer()[UserManager::CONTAINER_NAME] = function ($c) {
    return new UserManager(pg_connect("host=localhost port=5432 dbname=onhold user=cesar password=cesarccc2"));
};

$app->getContainer()[UserAddressManager::CONTAINER_NAME] = function ($c) {
    return new UserAddressManager(pg_connect("host=localhost port=5432 dbname=onhold user=cesar password=cesarccc2"));
};

$app->getContainer()[PostManager::CONTAINER_NAME] = function ($c) {
    return new PostManager(pg_connect("host=localhost port=5432 dbname=onhold user=cesar password=cesarccc2"));
};

$app->getContainer()[PostImagesManager::CONTAINER_NAME] = function ($c) {
    return new PostImagesManager(pg_connect("host=localhost port=5432 dbname=onhold user=cesar password=cesarccc2"));
};

$app->getContainer()[StorageManager::CONTAINER_NAME] = function ($c) {
    return new StorageManager(pg_connect("host=localhost port=5432 dbname=onhold user=cesar password=cesarccc2"));
};

$app->getContainer()[PostAddressManager::CONTAINER_NAME] = function ($c) {
    return new PostAddressManager(pg_connect("host=localhost port=5432 dbname=onhold user=cesar password=cesarccc2"));
};

$app->getContainer()[OrdersManager::CONTAINER_NAME] = function ($c) {
    return new OrdersManager(pg_connect("host=localhost port=5432 dbname=onhold user=cesar password=cesarccc2"));
};

$app->getContainer()[SlotsManager::CONTAINER_NAME] = function ($c) {
    return new SlotsManager(pg_connect("host=localhost port=5432 dbname=onhold user=cesar password=cesarccc2"));
};

$app->getContainer()[RolesManager::CONTAINER_NAME] = function ($c) {
    return new RolesManager(pg_connect("host=localhost port=5432 dbname=onhold user=cesar password=cesarccc2"));
};

////////////////// CONTAINERS ////////////////////



//////////////////////////////////////////////////
////-------------- ENDPOINTS -----------------////
//////////////////////////////////////////////////


////////////////// ENDPOINTS - POSTS ////////////////////

//GET ALL ACTIVE POSTS
$app->get('/posts/active', function(Request $request, Response $response, array $args) {
    $PostManager = $this->get(PostManager::CONTAINER_NAME);
    return $response->withJson($PostManager->retrieveAllActivePostsWithData());
});

//GET ALL POSTS By HOST
$app->get('/posts/host/{id}', function(Request $request, Response $response, array $args) {
    $PostManager = $this->get(PostManager::CONTAINER_NAME);
    return $response->withJson($PostManager->retrieveAllPostsByHostWithData($args['id']));
});

//GET POST'S BY ID
$app->get('/post/{id}', function(Request $request, Response $response, array $args) {
    $PostManager = $this->get(PostManager::CONTAINER_NAME);
    return $response->withJson($PostManager ->retrievePostByIDWithData($args['id']));
});

//GET ALL POSTS
$app->get('/posts', function(Request $request, Response $response, array $args) {
    $PostManager = $this->get(PostManager::CONTAINER_NAME);
    return $response->withJson($PostManager->retrieveAllPostsWithData());
});

// DELETE POST BY ID
$app->delete('/post/delete/{id}', function(Request $request, Response $response, array $args) {
    $PostManager = $this->get(PostManager::CONTAINER_NAME);
    $PostManager->deletePostByID($request->getParsedBody());
});

//CREATE POST
$app->post('/post/create', function(Request $request, Response $response, array $args) {
    $PostManager = $this->get(PostManager::CONTAINER_NAME);
    return $response->withJson($PostManager->insertPost($request->getParsedBody()));
});

//UPDATE POST
$app->post('/post/update/{id}', function(Request $request, Response $response, array $args) {
    $PostManager = $this->get(PostManager::CONTAINER_NAME);
    $PostManager->updatePost($args['id'],$request->getParsedBody());
});

// TOGGLE POST ACTIVE STATUS
$app->post('/post/toggle/{PostId}/{State}', function(Request $request, Response $response, array $args) {
    $PostManager = $this->get(PostManager::CONTAINER_NAME);
    $PostManager->TogglePostState($args['PostId'], $args['State']);
});

////////////////// POSTS ////////////////////

////////////////// ENDPOINTS - CLIENTS /////////////////

// INSERT CLIENT
$app->post('/client/create', function(Request $request, Response $response, array $args) {
    $UserManager = $this->get(UserManager::CONTAINER_NAME);
    return $response->withJson($UserManager->insertClient($request->getParsedBody()));
});

// INSERT CLIENT
$app->get('/clients', function(Request $request, Response $response, array $args) {
    $UserManager = $this->get(UserManager::CONTAINER_NAME);
    return $response->withJson($UserManager->ShowClients());
});
//UPDATE CLIENT
$app->post('/client/update/{id}', function(Request $request, Response $response, array $args) {
    $UserManager = $this->get(UserManager::CONTAINER_NAME);
    $UserManager->updateClient($args['id'],$request->getParsedBody());
});


//UPDATE Host Data
$app->post('/client/update/hostdata/{id}', function(Request $request, Response $response, array $args) {
    $UserManager = $this->get(UserManager::CONTAINER_NAME);
    $UserManager->updateHostData($_POST, $_FILES);
});

//UPDATE User Role
$app->post('/client/update/role/{id}', function(Request $request, Response $response, array $args) {
    $UserManager = $this->get(UserManager::CONTAINER_NAME);
    $UserManager->updateUserRole($args['id'], $request->getParsedBody());
});

//LOGGIN USER
$app->post('/client/login', function(Request $request, Response $response, array $args) {
    $UserManager = $this->get(UserManager::CONTAINER_NAME);
    return $response->withJson($UserManager->login($request->getParsedBody()));
});

////////////////// CLIENTS /////////////////

////////////////// ENDPOINTS - ORDERS /////////////////

//GET ALL ORDERS By HOST
$app->get('/orders/host/{id}', function(Request $request, Response $response, array $args) {
    $OrdersManager = $this->get(OrdersManager::CONTAINER_NAME);
    return $response->withJson($OrdersManager->getAllOrdersByHost($args['id']));
});

//GET ALL ORDERs By POST
$app->get('/order/post/{id}', function(Request $request, Response $response, array $args) {
    $OrdersManager = $this->get(OrdersManager::CONTAINER_NAME);
    return $response->withJson($OrdersManager->getOrdersByPost($args['id']));
});

// CREATE ORDER
$app->post('/order/create', function(Request $request, Response $response, array $args) {
    $OrdersManager = $this->get(OrdersManager::CONTAINER_NAME);
    $OrdersManager->createOrder($request->getParsedBody());
});

////////////////// ORDERS /////////////////

////////////////// ENDPOINTS - PERSONAL ADDRESS /////////////////

// GET PERSONAL ADDRESS BY ID
$app->get('/personaladdress/{id}', function(Request $request, Response $response, array $args) {
    $UserAddressManager = $this->get(UserAddressManager::CONTAINER_NAME);
    return $response->withJson($UserAddressManager->GetPersonalAddress($args['id'],$request->getQueryParams()['field'] ?? null));
});

// INSERT PERSONAL ADDRESS
$app->post('/personaladdress/create', function(Request $request, Response $response, array $args) {
    $UserAddressManager = $this->get(UserAddressManager::CONTAINER_NAME);
    $UserAddressManager->insertPersonalAddress($request->getParsedBody());
});

//PersonalAddress Update
$app->post('/personaladdress/update/{id}', function(Request $request, Response $response, array $args) {
    $UserAddressManager = $this->get(UserAddressManager::CONTAINER_NAME);
    $UserAddressManager->updatePersonalAddress($args['id'],$request->getParsedBody());
});

////////////////// PERSONAL ADDRESS /////////////////

////////////////// ENDPOINTS - POST ADDRESS /////////////////

// GET POST ADDRESS BY ID
$app->get('/postaddress/{id}', function(Request $request, Response $response, array $args) {
    $PostAddressManager = $this->get(PostAddressManager::CONTAINER_NAME);
    return $response->withJson($PostAddressManager->GetPostAddress($args['id'],$request->getQueryParams()['field'] ?? null));
});

// INSERT POST ADDRESS
$app->post('/postaddress/create', function(Request $request, Response $response, array $args) {
    $PostAddressManager = $this->get(PostAddressManager::CONTAINER_NAME);
    return $response->withJson($PostAddressManager->insertPostAddress($request->getParsedBody()));
});

//POST ADDRESS Update
$app->post('/postaddress/update/{id}', function(Request $request, Response $response, array $args) {
    $PostAddressManager = $this->get(PostAddressManager::CONTAINER_NAME);
    $PostAddressManager->updatePostAddress($args['id'],$request->getParsedBody());
});

////////////////// POST ADDRESS /////////////////

////////////////// ENDPOINTS - ROLE /////////////////

//GET ROLES
$app->get('/role', function(Request $request, Response $response, array $args) {
    $RolesManager = $this->get(RolesManager::CONTAINER_NAME);
    return $response->withJson($RolesManager->getRoles());
});

////////////////// ROLE /////////////////

////////////////// ENDPOINTS - SLOT /////////////////

//CREATE SLOT
$app->post('/slot/create', function(Request $request, Response $response, array $args) {
    $SlotsManager = $this->get(SlotsManager::CONTAINER_NAME);
    $SlotsManager->insertSlot($request->getParsedBody());
});

// GET SLOTS Of a Posts
$app->get('/slot/{id}', function(Request $request, Response $response, array $args) {
    $SlotsManager = $this->get(SlotsManager::CONTAINER_NAME);
    return $response->withJson($SlotsManager->getSlotsOfPost($args['id']));
});

//DELETE SELECTED SLOT
$app->delete('/slot/delete', function(Request $request, Response $response, array $args) {
    $SlotsManager = $this->get(SlotsManager::CONTAINER_NAME);
    $SlotsManager->DeleteSlot($request->getParsedBody());
});

//DELETE ALL SLOTS OF POST
$app->delete('/slot/deleteAll', function(Request $request, Response $response, array $args) {
    $SlotsManager = $this->get(SlotsManager::CONTAINER_NAME);
    $SlotsManager->DeleteSlot($request->getParsedBody());
});


////////////////// SLOT /////////////////

////////////////// ENDPOINTS - STORAGE /////////////////

//GET STORAGE SIZE
$app->get('/storagesize', function(Request $request, Response $response, array $args) {
    $StorageManager = $this->get(StorageManager::CONTAINER_NAME);
    return $response->withJson($StorageManager->getStorageSize());
});

//GET STORAGE TYPE
$app->get('/storagetype', function(Request $request, Response $response, array $args) {
    $StorageManager = $this->get(StorageManager::CONTAINER_NAME);
    return $response->withJson($StorageManager->getStorageType());
});

////////////////// STORAGE /////////////////


////////////////// ENDPOINTS - POST MEDIA /////////////////

//CREATE POST MEDIA
$app->post('/postmedia/create', function(Request $request, Response $response, array $args) {
    $PostImagesManager = $this->get(PostImagesManager::CONTAINER_NAME);
    $PostImagesManager->CreatePostMedia($request->getParsedBody(),$_FILES,$_POST);
});

//CREATE POST MEDIA
$app->delete('/postmedia/delete', function(Request $request, Response $response, array $args) {
    $PostImagesManager = $this->get(PostImagesManager::CONTAINER_NAME);
    $PostImagesManager->DeletePostMedia($request->getParsedBody());
});

////////////////// POST MEDIA /////////////////

//////////////////////////////////////////////////
////-------------- ENDPOINTS -----------------////
//////////////////////////////////////////////////


$app->run();
?>

