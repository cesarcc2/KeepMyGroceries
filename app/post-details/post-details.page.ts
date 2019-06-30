import { Component, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { DBService } from '../services/db.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps/ngx'
import { environment, Server } from '../../environments/environment';


@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.page.html',
  styleUrls: ['./post-details.page.scss'],
})
export class PostDetailsPage implements OnInit {

  mapDetails: GoogleMap;
  tabs = "Overview";
  Post: Post;
  Server: string = Server;

  sliderOpts = {
    zoom: false,
    slidesPerView: 1.5,
    centeredSlides: true,
    spaceBetween: 10
  }

  constructor(public router: Router, public DB: DBService, public Route: ActivatedRoute, private modalController: ModalController, private platform: Platform) {
  }


  doRefresh(event) {
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }


  async ngOnInit() {
    await this.platform.ready();
    this.Post = this.DB.ActivePosts.GetPostByID(this.Route.snapshot.paramMap.get("post"));
    console.log(this.Post);
    this.loadMap(this.Post.address, this.Post.title);
  }

  loadMap(address, postName) {
    console.log(address);
    this.mapDetails = GoogleMaps.create("map_canvasDetail", {
      camera: {
        target: {
          lat: +address.lat,
          lng: +address.long
        },
        zoom: 18,
        tilt: 30
      }
    });

    let markerDetails: Marker = this.mapDetails.addMarkerSync({
      title: postName,
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: +address.lat,
        lng: +address.long
      }
    });
    markerDetails.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
    });
  }


  UserService() {
    this.router.navigate(['use-service/' + this.Post.id]);
  }



}
