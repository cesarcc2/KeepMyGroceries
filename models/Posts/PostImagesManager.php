<?php
namespace OnHold\Posts;
class PostImagesManager {
    
    const CONTAINER_NAME = "PostImagesManager";
    const QUERY_INSERT_POST_MEDIA = 'INSERT into postmedia (imageurl) VALUES ($1) RETURNING postmedia.id';
    const QUERY_INSERT_POST_MEDIA_POST = 'INSERT into postmedia_post (idmedia, idpost) VALUES ($1,$2)';
    const QUERY_DELETE_POST_MEDIA_POST = 'DELETE from postmedia_post where idmedia=$1';
    const QUERY_DELETE_POST_MEDIA = 'DELETE from postmedia where id=$1';
    private $databaseConnection;

    /**
     * 
     * @param type $connection
     */
    public function __construct($connection) {
        $this->databaseConnection = $connection;
    }

     /**
     * Returns the data about the Storage Size
     */
    public function createPostMedia($data,$File,$Post){
        $target_path = "/var/www/html/onHold/Backend/uploads/post/";
        $target_path = $target_path . basename( $File['file']['name']);
        $PostId = $Post['id'];
        if(move_uploaded_file($File['file']['tmp_name'], $target_path)) {
            $mediaId = $this->insertPostMedia($File['file']['name']);
            $this->insertPostMediaPost($PostId, $mediaId);
        }
    }

    private function insertPostMedia($imageUrl){
        $query = pg_prepare($this->databaseConnection, "", PostImagesManager::QUERY_INSERT_POST_MEDIA);
        $query = pg_execute($this->databaseConnection, "", array($imageUrl));
        $row = pg_fetch_row($query);
        $id = $row['0'];
        return $id;
    }

    private function insertPostMediaPost($postID,$mediaID){
        $query = pg_prepare($this->databaseConnection, "", PostImagesManager::QUERY_INSERT_POST_MEDIA_POST);
        $query = pg_execute($this->databaseConnection, "", array($mediaID, $postID));
    }

    public function DeletePostMedia($data){
        $MediaID = $data['MediaID'];
        $ImageName = $data['ImageName'];

        $query = pg_prepare($this->databaseConnection, "", PostImagesManager::QUERY_DELETE_POST_MEDIA_POST);
        $query = pg_execute($this->databaseConnection, "", array($MediaID));

        $query = pg_prepare($this->databaseConnection, "", PostImagesManager::QUERY_DELETE_POST_MEDIA);
        $query = pg_execute($this->databaseConnection, "", array($MediaID));

        $this->DeleteImage($ImageName);
    }

    private function DeleteImage($ImageName){
        unlink('uploads/post/' . $ImageName);
    }
}
