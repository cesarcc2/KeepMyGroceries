<?php
namespace OnHold\Orders;

class OrdersManager {
    
    const CONTAINER_NAME = "OrderManager";
    const QUERY_GET_ALL_ORDERS_BY_HOST = 'SELECT orders.id, orders.idclient,orders.idpost,orders.dayrecieve,orders.daydeliver,orders.hourrecieve,orders.hourdeliver,orders.homedelivery,orders.details
                                            from orders
                                            INNER JOIN post on post.id = orders.idpost
                                            WHERE post.idclient=$1';
    const QUERY_GET_ORDERS_BY_POST = 'SELECT *
                                    from orders
                                    INNER JOIN post on post.id = orders.idpost
                                    WHERE orders.active=$1 and post.id=$2';
    const QUERY_POST_ORDER = 'INSERT into orders (dayrecieve,daydeliver,hourrecieve,hourdeliver,homedelivery,details,idclient,idpost,active) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)';
    private $databaseConnection;

    /**
     * 
     * @param type $connection
     */
    public function __construct($connection) {
        $this->databaseConnection = $connection;
    }


    /**
     * get all orders by host
     */
    function getAllOrdersByHost($HostID) {
        $query = pg_prepare($this->databaseConnection, "", OrdersManager::QUERY_GET_ALL_ORDERS_BY_HOST);
        $query = pg_execute($this->databaseConnection, "", array($HostID));
        return pg_fetch_all($query);
    }



    function getOrdersByPost($PostID){
        $query = pg_prepare($this->databaseConnection, "", OrdersManager::QUERY_GET_ORDERS_BY_POST);
        $query = pg_execute($this->databaseConnection, "", array('t', $PostID));
        return pg_fetch_all($query);
    }


    function createOrder($data) {
        $RecievingDay = $data['RecievingDay'];
        // $parts = explode(" ", $RecievingDay);
        // $RecievingDay = $parts['1'];
        // $RecievingDay = str_replace("-", " ", $RecievingDay);
        $RecievingHour = $data['RecievingHour'];
        $DeliverDay = $data['DeliverDay'];
        // $parts = explode(" ", $DeliverDay);
        // $DeliverDay = $parts['1'];
        // $DeliverDay = str_replace("-", " ", $DeliverDay);
        $DeliverHour = $data['DeliverHour'];
        $HomeDelivery = $data['HomeDelivery'];

        if ($HomeDelivery == false) {
            $HomeDelivery = 'f';
        } else {
            $HomeDelivery = 't';
        }
        
        $Details = $data['Details'] ?? '';
        $idClient = $data['idClient'];
        $idPost = $data['idPost'];

        $query = pg_prepare($this->databaseConnection, "", OrdersManager::QUERY_POST_ORDER);
        $active = 't';
        $query = pg_execute($this->databaseConnection, "", array($RecievingDay, $DeliverDay, $RecievingHour, $DeliverHour, $HomeDelivery, $Details, $idClient, $idPost, $active));
    }

}
