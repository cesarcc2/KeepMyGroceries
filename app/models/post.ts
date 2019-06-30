
import { UserHost } from "../models/host"
import { Address } from "../models/address"
import { SlotsList } from "./slotsList";
import { OrdersList } from "./ordersList";
export class Post {

    id: number;
    title: string;
    description: string;
    addressCode: number;
    active: boolean;
    homedelivery: boolean;
    storageprivacy: boolean;
    storagesize: number;
    storagetype: number;
    host: UserHost;

    //Address
    address: Address;

    //Images
    images: Array<string>;

    SlotList: SlotsList;
    Orders: OrdersList;

    constructor(id: number,
        title: string,
        description: string,
        addressCode: number,
        active: boolean,
        homedelivery: boolean,
        storageprivacy: boolean,
        storagesize: number,
        storagetype: number,
        host: UserHost,
        address: Address,
        images: Array<string>,
        SlotList:SlotsList,
        orders:OrdersList) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.active = active;
        this.homedelivery = homedelivery;
        this.storageprivacy = storageprivacy;
        this.addressCode = addressCode;
        this.storagesize = storagesize;
        this.storagetype = storagetype;
        this.host = host;

        this.address = address;

        this.images = images;
        this.SlotList = SlotList;
        this.Orders = orders;
    }

    Update() { }

    CheckIfHasOrders() {
    }
}


