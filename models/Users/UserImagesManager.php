<?php
namespace OnHold\Users;
class UserImagesManager{
    const CONTAINER_NAME = "UserImagesManager";

    private $databaseConnection;

    /**
     * 
     * @param type $connection
     */
    public function __construct($connection) {
        $this->databaseConnection = $connection;
    }

    //Deletes de given File
    public function DeleteClientPhoto($ClientID) {
        $PhotoToDelete = glob('../../uploads/host/Host-' . $ClientID . '*');
        if ($PhotoToDelete) {
            unlink($PhotoToDelete['0']);
        }
    }

}
