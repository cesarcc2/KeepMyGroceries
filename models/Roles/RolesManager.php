<?php
namespace OnHold\Roles;
class RolesManager {
    
    const CONTAINER_NAME = "RolesManager";
    const QUERY_GET_ROLES = 'SELECT * FROM "role"';
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
    public function getRoles(){
        $query = pg_prepare($this->databaseConnection, "", RolesManager::QUERY_GET_ROLES);
        $query = pg_execute($this->databaseConnection, "", array());
        return pg_fetch_all($query);
    }
    
}
