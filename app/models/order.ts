import { UserHost } from '../models/host';
import { Post } from '../models/post';

export class Order{

    id:number;
    host:UserHost;
    post:Post;
    dayRecieve:Date;
    dayDeliver:Date;
    hourRecieve:Date;
    hourDeliver:Date;
    homeDelivery:boolean;
    details:string;

    constructor(id:number,
        host:UserHost,
        post:Post,
        dayRecieve:Date,
        dayDeliver:Date,
        hourRecieve:Date,
        hourDeliver:Date,
        homeDelivery:boolean,
        details:string){

        this.id=id;
        this.host=host;
        this.post=post;
        this.dayRecieve=dayRecieve;
        this.dayDeliver=dayDeliver;
        this.hourRecieve=hourRecieve;
        this.hourDeliver=hourDeliver;
        this.homeDelivery=homeDelivery;
        this.details=details;
        }
}   