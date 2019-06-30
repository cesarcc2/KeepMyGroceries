<?php
namespace OnHold\Posts\Address;
class PostAddressManager {
    
    const CONTAINER_NAME = "PostAddressManager";
    const QUERY_GET_ADDRESS_WITHOUT_FIELD = 'SELECT * FROM postaddress WHERE id=$1';
    const QUERY_GET_ADDRESS_COUNTRY = 'SELECT country FROM postaddress WHERE id=$1';
    const QUERY_GET_ADDRESS_ADDRESS = 'SELECT address FROM postaddress WHERE id=$1';
    const QUERY_GET_ADDRESS_FLOOR = 'SELECT floor FROM postaddress WHERE id=$1';
    const QUERY_GET_ADDRESS_DOORNUMBER = 'SELECT doornumber FROM postaddress WHERE id=$1';
    const QUERY_GET_ADDRESS_CITY = 'SELECT city FROM postaddress WHERE id=$1';
    const QUERY_GET_ADDRESS_REGION = 'SELECT region FROM postaddress WHERE id=$1';
    const QUERY_GET_ADDRESS_POSTCODE = 'SELECT postcode FROM postaddress WHERE id=$1';
    const QUERY_INSERT_ADDRESS = 'INSERT into postaddress (country,address,floor,doornumber,city,region,postcode,lat,long) 
                                            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id';
    const QUERY_UPDATE_ADDRESS = 'UPDATE postaddress SET "country"=$1, "address"=$2, "floor"=$3, doornumber=$4, city=$5, "region"=$6, postcode=$7 WHERE id=$8';
    private $databaseConnection;

    /**
     * 
     * @param type $connection
     */
    public function __construct($connection) {
        $this->databaseConnection = $connection;
    }

     /**
     * Calls the function getPersonalAddressWithoutField if the variable "Field" is null retrieving every element of a client's Address 
     * Calls the function getPersonalAddressWithField and retrieves the value of the given field of a client's Address
     */
    public function GetPostAddress($clientID,$field){
        switch ($field) {
            case null:
                return $this->getPersonalAddressWithoutField($clientID);
                break;
            case 'country':
                return $this->getPersonalAddressWithField($clientID, $field);
                break;
            case 'address':
                return $this->getPersonalAddressWithField($clientID, $field);
                break;
            case 'floor':
                return $this->getPersonalAddressWithField($clientID, $field);
                break;
            case 'doornumber':
                return $this->getPersonalAddressWithField($clientID, $field);
                break;
            case 'city':
                return $this->getPersonalAddressWithField($clientID, $field);
                break;
            case 'region':
                return $this->getPersonalAddressWithField($clientID, $field);
                break;
            case 'postcode':
                return $this->getPersonalAddressWithField($clientID, $field);
                break;
        }
    }

    public function insertPostAddress($data){
        $country = $data['country'];
        $address = $data['address'];
        $floor = $data['floor'] ?? 0;
        $doornumber = $data['doornumber'] ?? 0;
        $city = $data['city'];
        $region = $data['region'];
        $postcode = $data['postcode'];
        $lat = $data['lat'];
        $long = $data['long'];
        $query = pg_prepare($this->databaseConnection, "", PostAddressManager::QUERY_INSERT_ADDRESS);
        $query = pg_execute($this->databaseConnection, "", array($country, $address, $floor, $doornumber, $city, $region, $postcode,$lat,$long));
        $row = pg_fetch_row($query);
        $id = $row['0'];
        return $id;
    }

    public function updatePostAddress($id,$data){
        $country = $data['country'];
        $address = $data['address'];
        $floor = $data['floor'] ?? 0;
        $doornumber = $data['doornumber'] ?? 0;
        $city = $data['city'];
        $region = $data['region'];
        $postcode = $data['postcode'];

        $query = pg_prepare($this->databaseConnection, "", PostAddressManager::QUERY_UPDATE_ADDRESS);
        $query = pg_execute($this->databaseConnection, "", array($country, $address, $floor, $doornumber, $city, $region, $postcode, $id));
    }


    /**
     * Returns the Client's Address by the given Client's ID
     */
    private function getPostAddressWithoutField($clientID){
        $query = pg_prepare($this->databaseConnection, "", PostAddressManager::QUERY_GET_ADDRESS_WITHOUT_FIELD);
        $query = pg_execute($this->databaseConnection, "", array($clientID));
        return pg_fetch_all($query);
    }

    /**
     * Returns the selected Field of the Client's Address by the given Client's ID
     */
    private function getPostAddressWithField($clientID,$field){
        switch ($field) {
            case 'country':
                $query = pg_prepare($this->databaseConnection, "", PostAddressManager::QUERY_GET_ADDRESS_COUNTRY);
                $query = pg_execute($this->databaseConnection, "", array($clientID));
                $query = pg_fetch_all($query);
                break;
            case 'address':
                $query = pg_prepare($this->databaseConnection, "", PostAddressManager::QUERY_GET_ADDRESS_ADDRESS);
                $query = pg_execute($this->databaseConnection, "", array($clientID));
                $query = pg_fetch_all($query);
                break;
            case 'floor':
                $query = pg_prepare($this->databaseConnection, "", PostAddressManager::QUERY_GET_ADDRESS_FLOOR);
                $query = pg_execute($this->databaseConnection, "", array($clientID));
                $query = pg_fetch_all($query);
                break;
            case 'doornumber':
                $query = pg_prepare($this->databaseConnection, "", PostAddressManager::QUERY_GET_ADDRESS_DOORNUMBER);
                $query = pg_execute($this->databaseConnection, "", array($clientID));
                $query = pg_fetch_all($query);
                break;
            case 'city':
                $query = pg_prepare($this->databaseConnection, "", PostAddressManager::QUERY_GET_ADDRESS_CITY);
                $query = pg_execute($this->databaseConnection, "", array($clientID));
                $query = pg_fetch_all($query);
                break;
            case 'region':
                $query = pg_prepare($this->databaseConnection, "", PostAddressManager::QUERY_GET_ADDRESS_REGION);
                $query = pg_execute($this->databaseConnection, "", array($clientID));
                $query = pg_fetch_all($query);
                break;
            case 'postcode':
                $query = pg_prepare($this->databaseConnection, "", PostAddressManager::QUERY_GET_ADDRESS_POSTCODE);
                $query = pg_execute($this->databaseConnection, "", array($clientID));
                $query = pg_fetch_all($query);
                break;
        }
        return $query;
    }

}
