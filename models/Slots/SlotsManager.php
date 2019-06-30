<?php
namespace OnHold\Slots;
class SlotsManager {
    
    const CONTAINER_NAME = "SlotManager";
    const QUERY_INSERT_SLOT = "INSERT into slot (daybegin,dayend,hourbegin,hourend) 
                                VALUES ($1,$2,$3,$4) RETURNING slot.id";
    const QUERY_INSERT_SLOT_POST = "INSERT into slot_post (idpost,idslot,slotdate) 
                                    VALUES ($1,$2,$3)";
    const QUERY_GET_SLOTS_OF_POST = 'SELECT S.id, SP.idpost as post, S.daybegin as "dayBegin", S.dayend as "dayEnd", S.hourbegin as "hourBegin", S.hourend as "hourEnd", SP.slotdate as slotDate from slot as S
                                    Inner Join slot_post as SP ON SP.idslot = S.id 
                                    WHERE SP.idPost = $1';
    const QUERY_DELETE_SLOT = 'DELETE from slot_post
                                USING slot,post 
                                where slot.id=slot_post.idslot and
                                slot.daybegin=$1
                                and slot.dayend=$2
                                and slot.hourbegin=$3 
                                and slot.hourend=$4 
                                and slot_post.idpost=$5
                                and slot_post.idpost=post.id
                                and post.idclient=$6';

    const QUERY_DELETE_ALL_SLOT_POST_OF_POST = 'DELETE from slot_post where idpost=$1';
    const QUERY_DELETE_SLOT_PER_ID = 'DELETE FROM slot WHERE id=$1';
    private $databaseConnection;

    /**
     * 
     * @param type $connection4
     */
    public function __construct($connection) {
        $this->databaseConnection = $connection;
    }


    /**
     * Calls the private functions insertSlotDB and insertSlot_PostDB to insert a new Slot
     */
    function insertSlot($data) {
        
        $ArrSlotId = [];
        $Slots = $data['Slots'];
        $PostID = $data['idPost'];
        $RegistDate = $data['RegistDate'];
        $this->DeleteAllSlotsOfPost($Slots,$PostID);
        foreach ($Slots as $Slot) {
            $StartingDay = $Slot['daybegin'];
            $EndingDay = $Slot['dayend'];
            $StartingHour = $Slot['hourbegin'];
            $EndingHour = $Slot['hourend'];
            $SlotId = $this->insertSlotDB($StartingDay, $EndingDay, $StartingHour, $EndingHour);
            array_push($ArrSlotId, $SlotId);
        }
    
        foreach ($ArrSlotId as $SlotId) {
            $this->insertSlot_POSTDB($PostID, $SlotId, $RegistDate);
        }
    }


     /**
     * Inserts Slot in the DataBase
     */
    private function insertSlotDB($StartingDay, $EndingDay, $StartingHour, $EndingHour){
        pg_prepare($this->databaseConnection, "", SlotsManager::QUERY_INSERT_SLOT);
        $query = pg_execute($this->databaseConnection, "", array($StartingDay, $EndingDay, $StartingHour, $EndingHour));
        $row = pg_fetch_row($query);
        $id = $row['0'];
        return $id;
    }

     /**
     * Inserts a regist in SlotPost refeered to the newly inserted Slot
     */
    private function insertSlot_POSTDB($PostID, $SlotId, $RegistDate){
        pg_prepare($this->databaseConnection, "", SlotsManager::QUERY_INSERT_SLOT_POST);
        $query = pg_execute($this->databaseConnection, "", array($PostID, $SlotId, $RegistDate));
    }

     /**
     * Returns every slot of a given Post
     */
    function getSlotsOfPost($PostID) {
        $Slots = [];
        $query = pg_prepare($this->databaseConnection, "", SlotsManager::QUERY_GET_SLOTS_OF_POST);
        $query = pg_execute($this->databaseConnection, "", array($PostID));
        $Slots = pg_fetch_all($query);
        return $Slots;
    }

     /**
     * Deletes a Slot by given ID
     */
    function DeleteSlot($data) {
        $dayRecieve = $data['dayRecive'];
        $dayDeliver = $data['dayDeliver'];
        $hourRecieve = $data['hourRecieve'];
        $hourDeliver = $data['hourDeliver'];
        $postId = $data['idPost'];
        $idClient = $data['idClient'];
        $query = pg_prepare($this->databaseConnection, "", SlotsManager::QUERY_DELETE_SLOT);
        $query = pg_execute($this->databaseConnection, "", array($daybegin, $dayend, $hourbegin, $hourend, $postId, $idClient));
        return pg_fetch_all($query);
    }

    private function DeleteAllSlotsOfPost($Slots,$PostID){
        foreach ($Slots as $slot) {
            if(isset($slot['id'])){
                $query = pg_prepare($this->databaseConnection, "", SlotsManager::QUERY_DELETE_SLOT_PER_ID);
                $query = pg_execute($this->databaseConnection, "", array($slot['id']));
            }

        }

        $this->DeleteAllSlot_Post($PostID);
    }

    private function DeleteAllSlot_Post($PostID){
        $query = pg_prepare($this->databaseConnection, "", SlotsManager::QUERY_DELETE_ALL_SLOT_POST_OF_POST);
        $query = pg_execute($this->databaseConnection, "", array($PostID));
    }

}
