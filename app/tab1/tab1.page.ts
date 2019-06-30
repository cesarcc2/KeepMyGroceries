import { Component, OnInit, ViewChild } from '@angular/core';
import { DBService } from '../services/db.service';
import { StorageTypeFilterSelectorPage } from '../modal/storage-type-filter-selector/storage-type-filter-selector.page';
import { StorageSizeFilterSelectorPage } from '../modal/storage-size-filter-selector/storage-size-filter-selector.page';
import { Router } from '@angular/router';
import { Server } from '../../environments/environment';
import { Post } from '../models/post';
import { ModalController, Platform, ActionSheetController } from '@ionic/angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker, LatLng, Circle } from '@ionic-native/google-maps/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google;
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  GoogleAutocomplete;
  PlaceDetailService;
  autocompleteItems;
  autocomplete;

  map: GoogleMap;
  Markers: Array<Marker> = [];
  Area: Circle;
  Server: string = Server;
  ActivePosts: Array<Post> = [];
  FilteredPosts: Array<Post> = [];
  SelectedPost: number;
  HomeDeliveryState: string = 'all';
  ToggleOptionsState: boolean = false;
  ActiveFilters = { "HomeDelivery": '-1', StorageSize: { "Value": -1, 'Description': 'Storage size' }, "StorageType": { "Value": -1, 'Description': 'Storage type' } };


  constructor(public router: Router, public DB: DBService, private nativeGeocoder: NativeGeocoder, private platform: Platform, private geolocation: Geolocation, private actionSheetController: ActionSheetController, private modalCtrl: ModalController) { }

  updateSearchResults() {
    console.log("a");
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }

    this.GoogleAutocomplete.getPredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if (predictions) {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        }
      });

  }

  eraseSearchInput(){
    console.log("a");
    this.autocompleteItems = [];
  }

  selectSearchResult(item) {
    console.log(item.description);

    if (this.Area) { this.Area.remove(); }

    this.nativeGeocoder.forwardGeocode(item.description)
      .then((result: NativeGeocoderResult[]) => {
        console.log('The coordinates are latitude=' + result[0].latitude + ' and longitude=' + result[0].longitude);
        this.map.setCameraTarget({ "lat": +result[0].latitude, "lng": +result[0].longitude });
        let coords = { "lat": +result[0].latitude, "lng": +result[0].longitude };
        this.autocompleteItems = [];

        this.Area = this.map.addCircleSync({
          center: coords,
          map: this.map,
          radius: 1000,    // 10 miles in metres
          fillColor: '#B5E9FF',
          strokeColor: '#AAD3FF',
          strokeWidth: 2
        });
        let PostsInThatArea: Array<Post> = [];
        let PostsForZoneSearch: Array<Post>;
        this.DB.GetActivePosts().then((List: Array<Post>) => {
          PostsForZoneSearch = List;
          PostsForZoneSearch.forEach(Post => {
            let PostCoords = [Post.address.lat, Post.address.long];
            let CenterCoords = [this.Area.getCenter().lat, this.Area.getCenter().lng];
            console.log(this.measure(CenterCoords[0], CenterCoords[1], PostCoords[0], PostCoords[1]));
            if (this.measure(CenterCoords[0], CenterCoords[1], PostCoords[0], PostCoords[1]) < 1000) {
              PostsInThatArea.push(Post);
              console.log("Dentro da Area");
            }
          });
          this.ActivePosts = PostsInThatArea;
        });

      }).catch((error: any) => console.log(error));
  }

  async ngOnInit() {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];

    await this.platform.ready();
    this.DB.GetActivePosts().then((result) => {
      console.log(this.DB.ActivePosts.GetAll());
      this.ActivePosts = this.DB.ActivePosts.GetAll();
      this.loadMap();
    }).catch((error) => {
      console.log(error);
    });
  }

  //Opens up the Options accordeon
  ToggleOptions() {
    this.ToggleOptionsState = !this.ToggleOptionsState;
  }

  async OpenStorageTypeFilterSelector() {
    const modal = await this.modalCtrl.create({
      component: StorageTypeFilterSelectorPage,
      componentProps: {
        'CurrentValue': this.ActiveFilters.StorageType.Value
      },
      cssClass: 'my-custom-modal-css'
    });

    modal.onDidDismiss()
      .then((data) => {
        data = data.data['value'];
        if (data) { this.ManageFilters("StorageType", data); }
      }).catch(() => { });

    return await modal.present();
  }

  async OpenStorageSizeFilterSelector() {
    const modal = await this.modalCtrl.create({
      component: StorageSizeFilterSelectorPage,
      componentProps: {
        'CurrentValue': this.ActiveFilters.StorageSize.Value
      },
      cssClass: 'my-custom-modal-css'
    });

    modal.onDidDismiss()
      .then((data) => {
        console.log(data);
        data = data.data['value'];
        console.log(data);
        if (data) { this.ManageFilters("StorageSize", data); }
      }).catch(() => { });

    return await modal.present();
  }

  ClearFilters() {
    this.HomeDeliveryState = 'all';
    this.ActiveFilters.HomeDelivery = '-1';
    this.ActiveFilters.StorageSize.Description = "Storage size"
    this.ActiveFilters.StorageType.Description = "Storage type"
    this.ActiveFilters.StorageSize.Value = -1;
    this.ActiveFilters.StorageType.Value = -1;
    this.ActivePosts = this.DB.ActivePosts.GetAll();
  }

  Select(postSelected) {
    this.SelectedPost = postSelected == this.SelectedPost ? this.SelectedPost = 0 : this.SelectedPost = postSelected;
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.CreateMap(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      //Mapa posiçao default caso nao detete a localizacao do utilizador
      this.CreateMap(0, 0);
    });
  }

  CreateMap(lat, long) {
    let canvas = document.getElementById("map_canvas");
    this.map = GoogleMaps.create(canvas, {
      camera: {
        target: {
          lat: lat,
          lng: long
        },
        zoom: 14,
        tilt: 20
      }
    });

    let marker: Marker = this.map.addMarkerSync({
      title: "You",
      icon: '#44A9D6',
      animation: 'DROP',
      position: {
        lat: lat,
        lng: long
      }
    });
    this.Markers.push(marker);
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
    });

    Object.values(this.ActivePosts).forEach(Post => {
      console.log("Marker" + Post);
      let marker: Marker = this.map.addMarkerSync({
        title: Post.title,
        icon: '#FFF',
        animation: 'DROP',
        position: {
          lat: +Post.address.lat,
          lng: +Post.address.long
        },

      });
      marker.set('id', Post.id);
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        let id = +marker.get('id');
        this.Select(id);
        this.scrollTo(Post.id);
      });
      this.Markers.push(marker);
    });
  }

  scrollTo(element) {
    // let content = document.querySelector('ion-content');
    document.getElementById(element).scrollIntoView();
    // let yOffset = document.getElementById(element).offsetTop + document.getElementById(element).offsetHeight;
    // content.scrollToPoint(0, yOffset);
  }

  PostDetail(post) {
    this.map.remove();
    this.router.navigate(['/post-details/' + post.id]);
  }

  doRefresh(event) {
    this.map.remove();
    this.ngOnInit();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }



  // Gets the filter and the value
  // Changes the Active Filter Array to the current selected filters
  // returns the posts given by the Filter method of the PostList object wich recieves the Active Filter Array.

  ManageFilters(filter, value) {
    switch (filter) {
      case 'HomeDelivery':
        this.filterHomeDelivery();
        break;


      case 'StorageType':
        this.ActiveFilters.StorageType.Value = value;

        switch (value) {
          case 1:
            this.ActiveFilters.StorageType.Description = "DRY";
            break;
          case 2:
            this.ActiveFilters.StorageType.Description = "REFRIGERATED";
            break;
          case 3:
            this.ActiveFilters.StorageType.Description = "DRY AND REFRIGERATED";
            break;
          case -1:
            this.ActiveFilters.StorageType.Description = "Storage type";
            break;
        }
        break;


      case 'StorageSize':
        this.ActiveFilters.StorageSize.Value = value;

        switch (value) {
          case 1:
            this.ActiveFilters.StorageSize.Description = "SMALL";
            break;
          case 2:
            this.ActiveFilters.StorageSize.Description = "MEDIUM";
            break;
          case 3:
            this.ActiveFilters.StorageSize.Description = "LARGE";
            break
          case 4:
            this.ActiveFilters.StorageSize.Description = "EXTRA LARGE";
            break;
          case -1:
            this.ActiveFilters.StorageSize.Description = "Storage size";
            break;
        }
        break;
    }
    this.ActivePosts = this.DB.ActivePosts.Filter(this.ActiveFilters);
  }

  filterHomeDelivery() {
    if (this.HomeDeliveryState == 'all') { this.HomeDeliveryState = 't' } else if (this.HomeDeliveryState == 't') { this.HomeDeliveryState = 'f'; } else { this.HomeDeliveryState = 't'; };
    this.ActiveFilters.HomeDelivery = this.HomeDeliveryState;
  }

  FindUserLocation() {
    for (let index = 0; index < this.Markers.length; index++) {
      if (this.Markers[index].getTitle() == "You") {
        this.Markers[index].destroy();
        this.Markers.splice(index, 1);
      }

    }
    this.geolocation.getCurrentPosition().then((resp) => {
      let coords: LatLng = new LatLng(resp.coords.latitude, resp.coords.longitude);
      this.map.setCameraTarget(coords);
      let marker: Marker = this.map.addMarkerSync({
        title: "You",
        icon: '#44A9D6',
        animation: 'DROP',
        position: coords
      });
      this.Markers.push(marker);
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
    console.log(this.Markers);
  }

  measure(lat1, lon1, lat2, lon2) {  // generally used geo measurement function
    let R = 6378.137; // Radius of earth in KM
    let dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    let dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d * 1000; // meters
  }

}