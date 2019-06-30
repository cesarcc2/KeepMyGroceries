<?php
namespace OnHold\Posts\Storage;
class StorageManager {
    
    const CONTAINER_NAME = "StorageManager";
    const QUERY_GET_STORAGE_SIZE = 'SELECT * FROM storagesize';
    const QUERY_GET_STORAGE_TYPE = 'SELECT * FROM storagetype';
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
    public function getStorageSize(){
        $query = pg_prepare($this->databaseConnection, "", StorageManager::QUERY_GET_STORAGE_SIZE);
        $query = pg_execute($this->databaseConnection, "", array());
        return pg_fetch_all($query);
    }
    

    /**
     * Returns the data about the Storage Size
     */
    public function getStorageType(){
        $query = pg_prepare($this->databaseConnection, "", StorageManager::QUERY_GET_STORAGE_TYPE);
        $query = pg_execute($this->databaseConnection, "", array());
        return pg_fetch_all($query);
    }
}
