<?php

namespace OnHold\Users;
use OnHold\Token\TokenManager;
use OnHold\Users\UserImagesManager;

class UserManager {
    
    const CONTAINER_NAME = "UserManager";

    const QUERY_VERIFY_EMAIL = "SELECT id FROM client WHERE email = $1";
    const QUERY_INSERT_CLIENT = 'INSERT into client ("role","name",surname,birthdate,
                                "address",email,phonenumber,"description",photo,password) 
                                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING client.id';
    const QUERY_UPDATE_CLIENT = 'UPDATE client SET "role"=$1, "name"=$2, surname=$3, birthdate=$4,
                                 address=$5, "email"=$6, phonenumber=$7, description=$8, "photo"=$9, password=$10 WHERE client.id=$11';
    const QUERY_UPDATE_HOST_DATA = 'UPDATE client SET "phonenumber"=$1, "description"=$2, "photo"=$3, "role"=3 WHERE id=$4';
    const QUERY_UPDATE_USER_ROLE = 'UPDATE client SET "role"=1 WHERE id=$2';
    const QUERY_LOGIN = 'SELECT * from client WHERE email=$1';
    private $databaseConnection;

    /**
     * 
     * @param type $connection
     */
    public function __construct($connection) {
        $this->databaseConnection = $connection;
    }


    /**
     * Inserts a client in the DB
     */
    public function insertClient($data) {

        $role = $data['role'] ?? 2;
        $name = $data['name'] ?? null;
        $surname = $data['surname'] ?? null;
        $birthdate = $data['birthdate'] ?? null;
        $address = $data['address'] ?? null;
        $email = $data['email'] ?? null;
        $phonenumber = $data['phonenumber'] ?? null;
        $description = $data['description'] ?? null;
        $photo = $data['photo'] ?? null;
        $password = password_hash($data['password'], PASSWORD_DEFAULT);

        //Verificar se o email já está em uso
        pg_prepare($this->databaseConnection, "", UserManager::QUERY_VERIFY_EMAIL);
        $query = pg_execute($this->databaseConnection, "", array($email));
    
        if (pg_num_rows($query)) {
            $state = false;
            $message = "Email Already Exists";
        } else {
            //Introducao do cliente na BD
            $query = pg_prepare($this->databaseConnection, "", UserManager::QUERY_INSERT_CLIENT);
            $query = pg_execute($this->databaseConnection, "", array($role, $name, $surname, $birthdate, $address, $email, $phonenumber, $description, $photo, $password));
            $ClientID = pg_fetch_row($query)['0'];

            $state = true;
            $message = "Client Inserted";
            $TokenManager = new TokenManager($this->databaseConnection);
            $Token = $TokenManager->GenerateToken($ClientID);
            
            $client = Array('id' => $ClientID, 'role' => $role, 'name' => $name, 'surname' => $surname,
            'birthdate' => $birthdate, 'address' => $address, 'email' => $email, 'phonenumber' => $phonenumber,
            'description' => $description, 'photo' => $photo, 'password' => $password);

        }
        return Array('State' => $state, 'Message' => $message, 'Token' => $Token, 'client' => $client);
    }

    /**
     * Updates de client Data
     */
   public function updateClient($ClientID, $data){
    $role = $data['role'] ?? 2;
    $name = $data['name'];
    $surname = $data['surname'];
    $birthdate = $data['birthdate'] ?? null;
    $address = $data['address'] ?? null;
    $email = $data['email'];
    $phonenumber = $data['phonenumber'] ?? null;
    $description = $data['description'] ?? '';
    $password = $data['password'];
    $photo = $data['photo'] ?? '';

    $UserImagesManager = new UserImagesManager($this->databaseConnection);
    $UserImagesManager->DeleteClientPhoto($ClientID);
    $url = $UserImagesManager->Base64ToJPG($ClientID,$photo);

    $query = pg_prepare($this->databaseConnection, "", UserManager::QUERY_UPDATE_CLIENT);
    $query = pg_execute($this->databaseConnection, "", array($role, $name, $surname, $birthdate, $address, $email, $phonenumber, $description, $url, $password, $ClientID));
   }

   public function updateHostData($Post, $File){
    $phoneNumber = $Post['phoneNumber'];
    $description = $Post['description'];
    $ClientID = $Post['id'];
    $target_path = "/var/www/html/onHold/Backend/uploads/host/";
    $target_path = $target_path . basename( $File['file']['name']);

    if(move_uploaded_file($File['file']['tmp_name'], $target_path)) {
        $query = pg_prepare($this->databaseConnection, "", UserManager::QUERY_UPDATE_HOST_DATA);
        $query = pg_execute($this->databaseConnection, "", array($phoneNumber, $description, $File['file']['name'], $ClientID));
    }

   }

   public function updateUserRole($id,$data){
    $role = $data['role'];  
    $query = pg_prepare($this->databaseConnection, "", UserManager::QUERY_UPDATE_USER_ROLE);
    $query = pg_execute($this->databaseConnection, "", array($id, $role));
   }


   public function login($data){
    $email = $data['email'];
    $password = $data['password'];
    $ClientData = $this->getEmailandPassword($email);
    $ClientData = $ClientData['0'];
    $clientID = $ClientData['id'];

    $Logged = FALSE;
    $State = "Email or password incorrect.";
    $Token;
    if ($ClientData && password_verify($password, $ClientData['password']) == TRUE) {
        $TokenManager = new TokenManager($this->databaseConnection);
        $Token = $TokenManager->GenerateToken($clientID);
        $Logged = TRUE;
        $State = "Logged in!";
    }
    return Array('Login' => $Logged, 'client' => $ClientData, 'State' => $State, 'Token' => $Token);
   }

   public function getEmailandPassword($email){
    $query = pg_prepare($this->databaseConnection, "", UserManager::QUERY_LOGIN);
    $query = pg_execute($this->databaseConnection, "", array($email));
    $results = pg_fetch_All($query);
    return $results;
   }

}
