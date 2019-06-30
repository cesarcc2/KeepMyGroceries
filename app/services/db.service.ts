import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserHost } from '../models/host';
import { Post } from '../models/post';
import { PostsList } from '../models/postsList';
import { Order } from '../models/order';
import { Address } from '../models/address';
import { OrdersList } from '../models/ordersList';
import { User } from '../models/user';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx'
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Server } from '../../environments/environment';
import { SlotsList } from '../models/slotsList';
import { Slot } from '../models/slot';



@Injectable({
  providedIn: 'root'
})
export class DBService {

  BaseURL: string = Server;
  Me: User | UserHost;
  MyPosts: PostsList = new PostsList();
  ActivePosts: PostsList = new PostsList();
  MyOrders: OrdersList = new OrdersList();
  Slot: Slot;

  constructor(private http: HttpClient, public router: Router, private nativeGeocoder: NativeGeocoder, private webview: WebView, private filePath: FilePath, private file: File, private toastController: ToastController, private loadingController: LoadingController) { }

  //-----------------------------------------------------------------------------------------------------------------------------//
  //-------------------------------------------------POST RELATED FUNCTIONS------------------------------------------------------//
  //-----------------------------------------------------------------------------------------------------------------------------//

  //Get all Active Posts from DataBase and its data : Data, Host, Images, Address and Slots. This function does not return Post's Orders.
  //Creates an Post Object for each fetch of the DataBase
  //Creates a PostsList with all the previous created Post objets
  //IF posts are fetched, RETURNS PostList
  //ELSE RETURNS false
  GetActivePosts() {
    return new Promise((resolve, reject) => {
      this.ActivePosts.DeleteAll();
      let reqOpts = {
        headers: {
          'Content-Type': 'application/json'
        },
        params: new HttpParams()
      };

      this.http.get(this.BaseURL + '/posts/active', reqOpts).subscribe(ActivePostsData => {
        if (!ActivePostsData == false) {

          let ArrActivePosts = ActivePostsData['Post'];
          let ArrActivePostHost = ActivePostsData['Host'];
          let ArrActivePostImages = ActivePostsData['Images'];
          let ArrActivePostAddress = ActivePostsData['Address'];
          let ArrActivePostSlots = ActivePostsData['Slots'];

          if (ArrActivePosts) {
            for (let i = 0; i < ArrActivePosts.length; i++) {
              let post = ArrActivePosts[i];

              let host = ArrActivePostHost[i];
              let images = ArrActivePostImages[i];
              let address = ArrActivePostAddress[i];
              let slots = ArrActivePostSlots[i];
              let ListSlots: SlotsList;
              ListSlots = new SlotsList();
              let OrdersList: OrdersList;
              if (slots !== []) {
                slots.forEach(slot => {
                  this.Slot = new Slot();
                  this.Slot.SetID(slot['id']);
                  this.Slot.SetDayBegin(slot['dayBegin']);
                  this.Slot.SetDayEnd(slot['dayEnd']);
                  this.Slot.SetHourBegin(slot['hourBegin']);
                  this.Slot.SetHourEnd(slot['hourEnd']);
                  this.Slot.SetDate(slot['slotdate']);
                  ListSlots.AddSlot(this.Slot);
                });
              }
                this.ActivePosts.Add((new Post(post.id, post.title, post.description, post.addresscode, post.active, post.homedelivery, post.storageprivacy, post.storagesizecode, post.storagetypecode, new UserHost(post.idclient, host.name, host.surname, host.role, host.password, host.email, host.birthdate, host.address, host.phonenumber, host.clientdescription, host.photo), new Address(post.addresscode, address.address, address.city, address.country, address.doornumber, address.floor, address.postcode, address.region, address.lat, address.long), images, ListSlots, OrdersList)));
            }
          }
          resolve(this.ActivePosts.GetAll());
        } else {
          reject(false);
        }
      });
    });
  }

  //Get all Active Posts from DataBase and its data : Data, Host, Images, Address, Slots and Orders.
  //Creates an Post Object for each fetch of the DataBase
  //Creates a PostsList with all the previous created Post objets
  //IF posts are fetched, RETURNS true
  //ELSE RETURNS false
  GetMyPosts() {
    return new Promise((resolve, reject) => {

      if (!this.MyPosts.IsEmpty()) {
        this.MyPosts.DeleteAll();
      }
      let reqOpts = {
        headers: {
          'Content-Type': 'application/json'
        },
        params: new HttpParams()
      };

      this.http.get(this.BaseURL + '/posts/host/' + this.Me.id, reqOpts).subscribe(AllPostData => {
        console.log(AllPostData);

        if (AllPostData !== false) {
          console.log("contem Data!");
          let ArrPosts = AllPostData['Post'];
          let ArrPostHost = AllPostData['Host'];
          let ArrPostImages = AllPostData['Images'];
          let ArrPostAddress = AllPostData['Address'];
          let ArrPostSlots = AllPostData['Slots'];
          let ArrPostOrders = AllPostData['Orders'];


          if (ArrPosts) {
            console.log("contem Posts!");
            for (let i = 0; i < ArrPosts.length; i++) {
              let post = ArrPosts[i];
              let host = ArrPostHost[i];
              let images = ArrPostImages[i];
              let address = ArrPostAddress[i];
              let orders = ArrPostOrders[i]
              let slots = ArrPostSlots[i];
              let ListSlots: SlotsList = new SlotsList();
              let OrdersList: OrdersList;
              if (slots !== []) {
                slots.forEach(slot => {
                  this.Slot = new Slot();
                  this.Slot.SetID(slot['id']);
                  this.Slot.SetDayBegin(slot['dayBegin']);
                  this.Slot.SetDayEnd(slot['dayEnd']);
                  this.Slot.SetHourBegin(slot['hourBegin']);
                  this.Slot.SetHourEnd(slot['hourEnd']);
                  this.Slot.SetDate(slot['slotdate']);
                  ListSlots.AddSlot(this.Slot);
                });
              }
              this.MyPosts.Add((new Post(post.id, post.title, post.description, post.addresscode, post.active, post.homedelivery, post.storageprivacy, post.storagesizecode, post.storagetypecode, new UserHost(post.idclient, host.name, host.surname, host.role, host.password, host.email, host.birthdate, host.address, host.phonenumber, host.description, host.photo), new Address(post.addresscode, address.address, address.city, address.country, address.doornumber, address.floor, address.postcode, address.region, address.lat, address.long), images, ListSlots, orders)));
            }
          }
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

  //Recieves post data from the user input
  //sends data to DataBase to create a new Post
  //IF posts are fetched, RETURNS true
  //ELSE RETURNS false
  CreatePost(title: string, description: string, address: any, homedelivery: boolean, storageprivacy: boolean, storagesize: number, storagetype: number, idclient: number) {
    return new Promise((resolve, reject) => {
      let reqOpts = {
        headers: {
          'Content-Type': 'application/json'
        },
        params: new HttpParams()
      };

      let params = {
        'title': title,
        'description': description,
        'address': address,
        'homedelivery': homedelivery,
        'storageprivacy': storageprivacy,
        'storagesize': storagesize,
        'storagetype': storagetype,
        'idclient': idclient
      }


      this.http.post(this.BaseURL + '/post/create', params, reqOpts)
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  //Recieves a post's ID and its active status
  //if post is not active it will toggle to active
  //if post is active and has active Orders it will stay active
  //if post is active and has no active Orders it will toggle to active
  //returns Post's updated active status
  ToggleActivatePost(PostId, PostActive) {
    return new Promise((resolve, reject) => {
      this.CheckIfPostHasOrders(PostId).then((data) => {
        if (PostActive == 't' && data == false) {
          PostActive = 'f';
        } else {
          PostActive = 't';
        }
        let reqOpts = {
          headers: {
            'Content-Type': 'application/json'
          },
          params: new HttpParams()
        };
        let params = {
          'PostId': PostId,
          'State': PostActive
        }
        this.http.post(this.BaseURL + '/post/toggle/' + PostId + "/" + PostActive, params, reqOpts)
          .subscribe(data => {
            resolve(PostActive);
          });
      });
    });
  }

  //Recieves a post's ID
  //Sends a Delete Request to the DataBase 
  //the body of the request contains the Post ID and the logged client ID
  DeletePost(postId) {
    return new Promise((resolve, reject) => {

      let reqOpts = {
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          'idPost': postId,
          'idClient': this.Me.id
        }
      };

      this.http.delete(this.BaseURL + '/post/delete', reqOpts)
        .subscribe(data => {
          resolve();
        });
    });
  }

  //Recieves the Media ID and the ImageName
  //Sends a Delete Request to the DataBase of given Image
  DeletePostMedia(MediaID, ImageName) {
    return new Promise((resolve, reject) => {

      let reqOpts = {
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          'MediaID': MediaID,
          'ImageName': ImageName
        }
      };

      this.http.delete(this.BaseURL + '/postmedia/delete', reqOpts)
        .subscribe(data => {
          resolve();
        });
    });
  }

  //Recieves Post Address data from the user input
  //sends data to DataBase to create a new Post Address
  //IF posts are fetched, RETURNS true
  //ELSE RETURNS false
  CreatePostAddress(country: string, address: string, postcode: string, floor: string, doornumber: string, city: string, region: string, lat: string, long: string) {
    return new Promise((resolve, reject) => {
      let reqOpts = {
        headers: {
          'Content-Type': 'application/json'
        },
        params: new HttpParams()
      };

      let params = {
        'country': country,
        'address': address,
        'postcode': postcode,
        'floor': floor,
        'doornumber': doornumber,
        'city': city,
        'region': region,
        'lat': lat,
        'long': long
      }


      this.http.post(this.BaseURL + '/postaddress/create', params, reqOpts)
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  //--------------------------------------------------------- END ---------------------------------------------------------------//
  //-------------------------------------------------POST RELATED FUNCTIONS------------------------------------------------------//
  //--------------------------------------------------------- END ---------------------------------------------------------------//


  //-----------------------------------------------------------------------------------------------------------------------------//
  //-------------------------------------------------SLOT RELATED FUNCTIONS------------------------------------------------------//
  //-----------------------------------------------------------------------------------------------------------------------------//

  //Returns Slots of given Post by Post ID
  GetSlots(postID) {
    return new Promise((resolve, reject) => {
      this.http.get(this.BaseURL + '/slot/' + postID).subscribe(Slots => {
        console.log(Slots);
        resolve(Slots);
      });
    });
  }

  //Recieves an array that contains a array of Slots, the Post ID and the Date of the entry
  //Inserts data in the DataBase
  InsertSlots(SlotRegist) {
    return new Promise((resolve, reject) => {
      let reqOpts = {
        headers: {
          'Content-Type': 'application/json'
        },
        params: new HttpParams()
      };
      let params = {
        'Slots': SlotRegist['0'],
        'idPost': SlotRegist['1'],
        'RegistDate': SlotRegist['2']
      }
      this.http.post(this.BaseURL + '/slot/create', params, reqOpts)
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  //--------------------------------------------------------- END ---------------------------------------------------------------//
  //-------------------------------------------------SLOT RELATED FUNCTIONS------------------------------------------------------//
  //--------------------------------------------------------- END ---------------------------------------------------------------//

  //-----------------------------------------------------------------------------------------------------------------------------//
  //-------------------------------------------------ORDER RELATED FUNCTIONS------------------------------------------------------//
  //-----------------------------------------------------------------------------------------------------------------------------//

  //Gets all the Orders of the logged host
  //Creates a Order Object for each fetch
  //Creates a OrdersList with all the Order objects
  GetMyOrders() {
    return new Promise((resolve, reject) => {
      if (!this.MyOrders.IsEmpty()) {
        this.MyOrders.DeleteAll();
      }
      let reqOpts = {
        headers: {
          'Content-Type': 'application/json'
        },
        params: new HttpParams()
      };

      this.http.get(this.BaseURL + '/orders/host/' + this.Me.id, reqOpts).subscribe(Orders => {
        if (Orders) {
          let ArrOrders = Object.values(Orders);
          ArrOrders.forEach(order => {
            this.MyOrders.Add(new Order(order.id, this.Me, this.MyPosts.GetPostByID(order.idpost), order.dayrecieve, order.daydeliver, order.hourrecieve, order.hourdeliver, order.homedelivery, order.details));
          });
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

  //Gets user input data
  //Sends Order data to database
  SetOrder(RecievingDay, RecievingHour, DeliverDay, DeliverHour, homedelivery, details, idPost) {
    console.log("entrou no serviço");
    return new Promise((resolve, reject) => {
      let reqOpts = {
        headers: {
          'Content-Type': 'application/json'
        },
        params: new HttpParams()
      };

      let params = {
        'RecievingDay': RecievingDay,
        'RecievingHour': RecievingHour,
        'DeliverDay': DeliverDay,
        'DeliverHour': DeliverHour,
        'HomeDelivery': homedelivery,
        'Details': details,
        'idClient': this.Me.id,
        'idPost': idPost
      }

      this.http.post(this.BaseURL + '/order/create', params, reqOpts)
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  //Sends Post ID to database to get all the order's of given Post
  //Returns the order's data or FALSE
  CheckIfPostHasOrders(postId) {
    return new Promise((resolve, reject) => {
      this.http.get(this.BaseURL + '/order/post/' + postId).subscribe(data => {
        resolve(data);
      });
    });
  }

  //--------------------------------------------------------- END ---------------------------------------------------------------//
  //-------------------------------------------------ORDER RELATED FUNCTIONS------------------------------------------------------//
  //--------------------------------------------------------- END ---------------------------------------------------------------//

  //-----------------------------------------------------------------------------------------------------------------------------//
  //-------------------------------------------------USER RELATED FUNCTIONS------------------------------------------------------//
  //-----------------------------------------------------------------------------------------------------------------------------//


  //Recieves user's email and password
  // sends data to database for validation
  // Recieves from database the user's data and a token and the state of the login (true | false)
  // if the login == true, calls the createClient Function, stores in the localStorage the Token and Returns true
  // if the login == false it returns false
  Login(email: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      let body = new FormData();
      body.append('email', email);
      body.append('password', password);

      this.http.post(this.BaseURL + '/client/login', body, { headers: headers })
        .subscribe(data => {
          if (data['Login']) {
            this.CreateClient(data['client']);
            localStorage.setItem('Token', data['Token']);
            resolve(true);
          } else {
            reject(data['State']);
          }
        });
    });
  }

  //Recieves user's data
  // if the password and confirmation password do not match it returns a warning
  // else sends the data to dataBase to be validated
  // the DataBase returns the State of the register (true|false)
  // if the state is false it returns a warning message
  // else it stores in the local storage the user's token, calls the createCliente function and 
  // returns the client's object previously created
  Register(name: string, surname: string, email: string, password: string, confpassword: string) {
    return new Promise((resolve, reject) => {
      if (password !== confpassword) {
        reject('Password and password confirmation dont match.');
      } else {
        const reqOpts = {
          headers: {
            'Content-Type': 'application/json'
          },
          params: new HttpParams()
        };

        const params = {
          'name': name,
          'surname': surname,
          'email': email,
          'password': password
        };

        this.http.post(this.BaseURL + '/client/create', params, reqOpts)
          .subscribe(data => {
            if (data['State'] === false) {
              reject(data['Message']);
            } else {
              localStorage.setItem('Token', data['Token']);
              this.CreateClient(data['client']);
              resolve(this.Me);
            }
          });

      }
    });
  }

  // Deletes the user's Token set in the local storage
  // Sets the user's object as null
  LogOut() {
    localStorage.removeItem('Token');
    if (this.Me) {
      this.Me = null;
    }
  }

  //Get's client data
  //if the client's role == 2
  //Creates a new User Object
  //if the client's role == 3
  //Creates a new UserHost Object
  CreateClient(client) {
    if (client.role == 2) {
      this.Me = new User(client.id, client.name, client.surname, 1, client.password, client.email, client.birthdate, client.address, client.phonenumber, client.description, client.photo);
    } else if (client.role == 3) {
      this.Me = new UserHost(client.id, client.name, client.surname, 2, client.password, client.email, client.birthdate, client.address, client.phonenumber, client.description, client.photo);
    }
    console.log("DB - CREATE CLIENT: " + this.Me);
  }

  //Checks if there is a Client Logged in
  // if the Me Object is undefined then the user is not logged in, returns false
  // if the Me Object has an id then it returns true.
  IsClientLogedIn() {
    if (!this.Me) {
      console.log("Me not Defined!")
      return false;
    } else if (this.Me.id) {
      return true;
    } else {
      return false;
    }
  }

  // sends to the DataBase the Role of the Me object to update the logged User's Role
  UpdateUserRole() {
    return new Promise((resolve, reject) => {
      let reqOpts = {
        headers: {
          'Content-Type': 'application/json'
        },
        params: new HttpParams()
      };

      let params = {
        'role': this.Me.role
      }


      this.http.post(this.BaseURL + '/client/update/role/' + this.Me.id, params, reqOpts)
        .subscribe(data => {
          resolve(true);
        });
    });
  }

  // Defines the User as a Host
  // Changes the Role atribute of the Me object as 3
  // sets tje Me object as a new UserHost object with the same data
  // Calls updateUserRole function to update the role in the DataBase
  UpdateRole() {
    this.Me.UpdateRole();
    this.Me = new UserHost(this.Me.id, this.Me.name, this.Me.surname, this.Me.role, this.Me.password, this.Me.email, this.Me.birthdate, this.Me.address, this.Me.phoneNumber, this.Me.description, this.Me.photo);
    this.UpdateUserRole();
  }

  // Checks if the Me object has the Host data, if it returns true and the role == 2 then
  // cals the UpdateRole funtion and calls the checkHostState.
  // if the Me object has hostData and role !== 2 then the user is already Host and has all needed data and it returns True
  checkHostState() {
    if (!this.Me.HasHostData()) {
      return false;
    } else if (this.Me.role == 2) {
      this.UpdateRole();
      this.checkHostState();
    } else {
      return true;
    }
  }

  //--------------------------------------------------------- END ---------------------------------------------------------------//
  //-------------------------------------------------USER RELATED FUNCTIONS------------------------------------------------------//
  //--------------------------------------------------------- END ---------------------------------------------------------------//

  GetLatandLong(Address) {
    return new Promise((resolve, reject) => {
      console.log(Address);
      this.nativeGeocoder.forwardGeocode(Address)
        .then((coordinates) => {
          let coordinatesArr = [];
          coordinatesArr.push(coordinates[0].latitude, coordinates[0].longitude);
          resolve(coordinatesArr);
        }).catch((error: any) => { console.log("erro forwardgeocode"); reject("false") });
    });
  }

}
