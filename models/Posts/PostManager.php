<?php
namespace OnHold\Posts;
use OnHold\Slots\SlotsManager;
use OnHold\Orders\OrdersManager;
class PostManager {
    
    const CONTAINER_NAME = "PostManager";

    const QUERY_GET_ALL_POSTS = "SELECT post.id,post.title,
                                post.description,
                                active,
                                homedelivery, 
                                storageprivacy, 
                                storagesize, 
                                storagetype,
                                post.address as addressCode,
                                post.idclient as idclient,
                                post.storagesize as storagesizeCode,
                                post.storagetype as storagetypeCode,
                                storagesize.title as storageSize,
                                storagetype.description as storageType
                                FROM post 
                                INNER JOIN storagetype ON post.storagetype = storagetype.id 
                                INNER JOIN storagesize ON post.storagesize = storagesize.id";

    const QUERY_GET_ALL_ACTIVE_POSTS = "SELECT post.id,post.title,
                                        post.description,
                                        active,
                                        homedelivery, 
                                        storageprivacy, 
                                        storagesize, 
                                        storagetype,
                                        post.address as addressCode,
                                        post.idclient as idclient,
                                        pa.country, 
                                        pa.address, 
                                        pa.floor, 
                                        pa.doornumber, 
                                        pa.city, 
                                        pa.region, 
                                        pa.postcode,
                                        post.storagesize as storagesizeCode,
                                        post.storagetype as storagetypeCode,
                                        storagesize.title as storageSize,
                                        storagetype.description as storageType
                                        FROM post 
                                        INNER JOIN postaddress as pa ON post.address = pa.id 
                                        INNER JOIN storagetype ON post.storagetype = storagetype.id 
                                        INNER JOIN storagesize ON post.storagesize = storagesize.id
                                        WHERE post.active = $1";
    const QUERY_GET_ALL_POSTS_BY_HOST = "SELECT post.id,post.title,
                                        post.description,
                                        active,
                                        homedelivery, 
                                        storageprivacy, 
                                        storagesize, 
                                        storagetype,
                                        post.address as addressCode,
                                        post.idclient as idclient,
                                        pa.country, 
                                        pa.address, 
                                        pa.floor, 
                                        pa.doornumber, 
                                        pa.city, 
                                        pa.region, 
                                        pa.postcode,
                                        post.storagesize as storagesizeCode,
                                        post.storagetype as storagetypeCode,
                                        storagesize.title as storageSize,
                                        storagetype.description as storageType
                                        FROM post 
                                        INNER JOIN postaddress as pa ON post.address = pa.id 
                                        INNER JOIN storagetype ON post.storagetype = storagetype.id 
                                        INNER JOIN storagesize ON post.storagesize = storagesize.id
                                        WHERE post.idclient=$1";

    CONST QUERY_GET_POST_BY_ID = "SELECT post.id,post.title,
                                post.description,
                                active,
                                homedelivery, 
                                storageprivacy, 
                                storagesize, 
                                storagetype,
                                post.address as addressCode,
                                post.idclient as idclient,
                                post.storagesize as storagesizeCode,
                                post.storagetype as storagetypeCode,
                                storagesize.title as storageSize,
                                storagetype.description as storageType
                                FROM post 
                                INNER JOIN storagetype ON post.storagetype = storagetype.id 
                                INNER JOIN storagesize ON post.storagesize = storagesize.id
                                WHERE post.id=$1";

    const QUERY_DELETE_POST_BY_ID = "DELETE from post where post.id=$1 and post.idclient=$2";
    const QUERY_INSERT_POST = "INSERT into post 
                               (title,description,address,active,homedelivery,storageprivacy,storagesize,storagetype,idclient) 
                               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)  RETURNING post.id";

    const QUERY_UPDATE_POST = "UPDATE post SET title =$1 ,description=$2, address=$3, active=$4, homedelivery=$5, storageprivacy=$6, storagesize=$7, storagetype=$8 
                               WHERE post.id=$9";

    const QUERY_TOGGLE_POST_STATUS = 'UPDATE post SET "active"=$1 WHERE id=$2';
    const QUERY_ALL_IMAGES_FROM_POST = 'SELECT postmedia.imageurl,postmedia.id
                                        FROM postmedia_post
                                        INNER JOIN postmedia ON postmedia_post.idmedia = postmedia.id 
                                        WHERE postmedia_post.idpost=$1';
    const QUERY_ADDRESS_FROM_POST = 'SELECT * FROM postaddress WHERE id=$1';
    const QUERY_HOST_OF_POST = 'SELECT name, surname, birthdate, email, phonenumber, client.description as ClientDescription, photo, role.description as roleDescription
                                FROM client 
                                INNER JOIN role ON client.role = role.id 
                                WHERE client.id=$1';
    private $databaseConnection;

    /**
     * 
     * @param type $connection
     */
    public function __construct($connection) {
        $this->databaseConnection = $connection;
    }


    /**
     * select every post on DB
     */
    public function retrieveAllPosts() {
        pg_prepare($this->databaseConnection, "", PostManager::QUERY_GET_ALL_POSTS);
        $query = pg_execute($this->databaseConnection, "", array());
        return pg_fetch_all($query);
    }

    /**
     * select every post on DB By Host
     */
    public function retrieveAllPostsByHost($HostId) {
        pg_prepare($this->databaseConnection, "", PostManager::QUERY_GET_ALL_POSTS_BY_HOST);
        $query = pg_execute($this->databaseConnection, "", array($HostId));
        return pg_fetch_all($query);
    }

    /**
     * Calls retrievePostByID and then retrievePOSTDATA and returns an array with every data of the post of the given ID
     */
    public function retrievePostByIDWithData($PostID){
        $PostData = $this->retrievePostByID($PostID);
        $PostImages = $this->retrievePostData($id,$IMAGES_QUERY);
        $PostAddress = $this->retrievePostData($PostData['0']['addresscode'],$ADDRESS_QUERY);
        $PostHost = $this->retrievePostData($PostData['0']['idclient'],$CLIENT_QUERY);
        return Array('Post' => $PostData, 'Images' => $PostImages, 'Address' => $PostAddress, 'Host' => $PostHost);
    }

    /**
     * Calls retrievePostByID and then retrievePOSTDATA and returns an array with all the data of every post
     */
    public function retrieveAllPostsWithData(){
        $PostData = $this->retrieveAllPosts();
        if ($PostData){
            $PostImages = [];
            $PostAddress = [];
            $PostHost = [];
            for ($i = 0; $i < count($PostData); $i++) {
                $images = $this->retrievePostData($PostData[$i]['id'],PostManager::QUERY_ALL_IMAGES_FROM_POST);
                if ($images == false) {
                    array_push($PostImages, []);
                } else {
                    array_push($PostImages, $images);
                }
                array_push($PostAddress, $this->retrievePostData($PostData[$i]['addresscode'],PostManager::QUERY_ADDRESS_FROM_POST)['0']);
                array_push($PostHost, $this->retrievePostData($PostData[$i]['idclient'],PostManager::QUERY_HOST_OF_POST)['0']);
            }

            return Array('Post' => $PostData, 'Images' => $PostImages, 'Address' => $PostAddress, 'Host' => $PostHost);
        }
        return $response->withJson(false);
    }

    /**
     * Retrieves all posts with all post data of given host
     */
    public function retrieveAllPostsByHostWithData($HostId){
        $PostData = $this->retrieveAllPostsByHost($HostId);
        if ($PostData){
            $PostImages = [];
            $PostAddress = [];
            $PostHost = [];
            $PostSlots = [];
            $PostOrders= [];
            
            for ($i = 0; $i < count($PostData); $i++) {
                $images = $this->retrievePostData($PostData[$i]['id'],PostManager::QUERY_ALL_IMAGES_FROM_POST);
                if ($images == false) {
                    array_push($PostImages, []);
                } else {
                    array_push($PostImages, $images);
                }
                array_push($PostAddress, $this->retrievePostData($PostData[$i]['addresscode'],PostManager::QUERY_ADDRESS_FROM_POST)['0']);
                array_push($PostHost, $this->retrievePostData($PostData[$i]['idclient'],PostManager::QUERY_HOST_OF_POST)['0']);
                
                $SlotsManager = new SlotsManager($this->databaseConnection);
                $Slots = $SlotsManager->getSlotsOfPost($PostData[$i]['id']);
                if($Slots == false){
                    array_push($PostSlots, []);  
                }else{
                    array_push($PostSlots, $Slots);
                }

                $OrdersManager = new OrdersManager($this->databaseConnection);
                $Orders = $OrdersManager->getOrdersByPost($PostData[$i]['id']);;
                if($Orders == false){
                    array_push($PostOrders, []);  
                }else{
                    array_push($PostOrders, $Orders);
                }
            }

            return Array('Post' => $PostData, 'Images' => $PostImages, 'Address' => $PostAddress, 'Host' => $PostHost, 'Slots' => $PostSlots,'Orders' => $PostOrders);
        }
        return false;
    }

    public function retrieveAllActivePostsWithData(){
        
        // get all the posts

        // for each post

        // calculate the availability

        // return the next available post

        $PostData = $this->retrieveAllActivePosts();
        if ($PostData){
            $PostImages = [];
            $PostAddress = [];
            $PostHost = [];
            $PostSlots = [];
            for ($i = 0; $i < count($PostData); $i++) {
                $images = $this->retrievePostData($PostData[$i]['id'],PostManager::QUERY_ALL_IMAGES_FROM_POST);
                if ($images == false) {
                    array_push($PostImages, []);
                } else {
                    array_push($PostImages, $images);
                }
                array_push($PostAddress, $this->retrievePostData($PostData[$i]['addresscode'],PostManager::QUERY_ADDRESS_FROM_POST)['0']);
                array_push($PostHost, $this->retrievePostData($PostData[$i]['idclient'],PostManager::QUERY_HOST_OF_POST)['0']);
                
                $SlotsManager = new SlotsManager($this->databaseConnection);
                $Slots = $SlotsManager->getSlotsOfPost($PostData[$i]['id']);
                if($Slots == false){
                    array_push($PostSlots, []);  
                }else{
                    array_push($PostSlots, $Slots);
                }
            
            }

            return Array('Post' => $PostData, 'Images' => $PostImages, 'Address' => $PostAddress, 'Host' => $PostHost, 'Slots' => $PostSlots);
        }
        return false;
    }

    /**
     * 
     * Get Data From every post on DB
     * @param int $postId
     * @param string $PreparedQuery
     */
    public function retrievePostData($postId,$PreparedQuery) {
        pg_prepare($this->databaseConnection, "", $PreparedQuery);
        $query = pg_execute($this->databaseConnection, "", array($postId));
        return pg_fetch_all($query);
    }

    /**
     * select every active post on DB
     */
    public function retrieveAllActivePosts(){
        $query = pg_prepare($this->databaseConnection, "", PostManager::QUERY_GET_ALL_ACTIVE_POSTS);
        $query = pg_execute($this->databaseConnection, "", array('t'));
        return pg_fetch_all($query);
    }

    /**
     * select post of given ID
     */
    public function retrievePostByID($PostID){
        $query = pg_prepare($this->databaseConnection, "", PostManager::QUERY_GET_POST_BY_ID);
        $query = pg_execute($this->databaseConnection, "", array($PostID));
        return pg_fetch_all($query);
    }


    /**
     * Deletes given Post by ID
     */
    public function deletePostByID($data){
        $query = pg_prepare($this->databaseConnection, "", PostManager::QUERY_DELETE_POST_BY_ID);
        $query = pg_execute($this->databaseConnection, "", array($data['idPost'], $data['idClient']));
        return pg_fetch_all($query);
    }

    /**
     * Insert Post
     */
    public function insertPost($data) {
        $title = $data['title'];
        $description = $data['description'];
        $address = $data['address'];
        $active = $data['active'] ?? 0;
        $homedelivery = $data['homedelivery'];
        $storageprivacy = $data['storageprivacy'];
        $storagesize = $data['storagesize'];
        $storagetype = $data['storagetype'];
        $idclient = $data['idclient'];
        $query = pg_prepare($this->databaseConnection, "", PostManager::QUERY_INSERT_POST);
        $query = pg_execute($this->databaseConnection, "", array($title, $description, $address, $active, $homedelivery, $storageprivacy, $storagesize, $storagetype, $idclient));
        $row = pg_fetch_row($query);
        $id = $row['0'];
        return $id;
    }

    /**
     * Update Post
     */
    function updatePost($id, $data) {
        $title = $data['title'];
        $description = $data['description'];
        $address = $data['address'];
        $active = $data['active'];
        $homedelivery = $data['homedelivery'];
        $storageprivacy = $data['storageprivacy'];
        $storagesize = $data['storagesize'];
        $storagetype = $data['storagetype'];
        $query = pg_prepare($this->databaseConnection, "", PostManager::QUERY_UPDATE_POST);
        $query = pg_execute($this->databaseConnection, "", array($title, $description, $address, $active, $homedelivery, $storageprivacy, $storagesize, $storagetype, $id));
    }

    /**
     * Toggle Post Active Status
     */
    function TogglePostState($PostId, $State) {
        $query = pg_prepare($this->databaseConnection, "", PostManager::QUERY_TOGGLE_POST_STATUS);
        $query = pg_execute($this->databaseConnection, "", array($State, $PostId));
    }

}
