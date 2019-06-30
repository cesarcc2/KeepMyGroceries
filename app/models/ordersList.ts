import { Order } from "./order"

export class OrdersList {
    OrdersList: Array<Order>;

    constructor() {
        this.OrdersList = [];

    }

    ///////////// GETS ///////////////

    IsEmpty() {
        if (this.OrdersList.length == 0) {
            return true;
        } else {
            return false;
        }
    }

    // Returns every order in the ORDERS array
    GetAll() {
        return this.OrdersList;
    }


    // Returns the order of given ID
    GetOrderByID(OrderID) {
        let result;
        this.OrdersList.forEach(order => {
            // console.log(order);
            if (order.id == OrderID) {
                result = order;
            }
        });
        if (!result) {
            result = "Order Not Found";
        }
        return result;
    }

    // Returns every Order of a host by giving the host ID
    GetOrdersByHostID(HostID) {
        let result: Array<Order> = [];
        this.OrdersList.forEach(order => {
            console.log(order);
            console.log(order.host.GetID());
            if (order.host.GetID() == HostID) {
                result.push(order);
            }
        });
        return result;
    }

    // Returns every Order of a post by giving the post ID
    GetOrdersByPostID(PostID) {
        let result: Array<Order> = [];
        this.OrdersList.forEach(order => {
            // console.log(order);
            // console.log(order.post.id);
            if (order.post.id == PostID) {
                result.push(order);
            }
        });
        return result;
    }


    NumberOrdersPerPost(PostID){
        let i:number = 0;
        this.OrdersList.forEach(order =>{
            if (order.post.id == PostID){
                i++;
            }
        });
        return i;
    }
    ///////////// GETS END ///////////////


    /////////////   SETS   ///////////////

    //Adds a Order Object in the ORDERS array
    Add(Order: Order) {
        this.OrdersList.push(Order);
    }


    //Deletes every Order Object from ORDERS array
    DeleteAll() {
        this.OrdersList = [];
    }

    ///////////// END SETS  ///////////////

}   