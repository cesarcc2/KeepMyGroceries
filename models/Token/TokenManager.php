<?php
namespace OnHold\Token;
use \Firebase\JWT\JWT;
use \Datetime;
class TokenManager{

    private $databaseConnection;

    /**
     * 
     * @param type $connection
     */
    public function __construct($connection) {
        $this->databaseConnection = $connection;
    }

    public function GenerateToken($idx) {
        $now = new DateTime();
        // $future = new DateTime("now +1 hours");
        $secret = "umsegredoxpto";

        $payload = [
            "id" => $idx,
            "iat" => $now->getTimeStamp(),
                // "nbf" => $future->getTimeStamp()
        ];

        $token = JWT::encode($payload, $secret, 'HS256');
        return $token;
    }

    public function ValidateToken($Token) {
        $State = FALSE;
        $Token = substr($Token[0], 7);
        if ($Token !== "null") {
            $secret = "umsegredoxpto";
            $decoded = JWT::decode($Token, $secret, array('HS256'));
            $idbearer = $decoded->id;
            pg_prepare($this->databaseConnection, "TokenVerify", 'SELECT name FROM client WHERE id = $1');
            $query = pg_execute($this->databaseConnection, "TokenVerify", array($idbearer));
            $result = pg_num_rows($query);
            if ($result) {
                $State = TRUE;
            }
        }
        return $State;
    }
}