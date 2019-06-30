import { Component, NgZone, OnInit } from '@angular/core';
import { DBService } from '../../services/db.service';
import { ModalController } from '@ionic/angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps/ngx';
declare var google;

@Component({
  selector: 'app-address-picker',
  templateUrl: './address-picker.page.html',
  styleUrls: ['./address-picker.page.scss'],
})
export class AddressPickerPage implements OnInit {
  map;
  markers;
  Geocoder;
  GoogleAutocomplete;
  PlaceDetailService;
  autocompleteItems;
  autocomplete;
  SelectedAddressState: boolean = false;
  submitionValidationState: boolean = true;
  Position;
  //Form Binding Variables
  country;
  address;
  postCode;
  doorNumber;
  city;
  region;
  floor;

  Address = {
    street_number: null,
    route: null,
    locality: null,
    administrative_area_level_1: null,
    country: null,
    postal_code: null,
    floor:0
  };

  constructor(private DB: DBService,private modalController: ModalController) {
  }

  ngOnInit() {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.Geocoder = new google.maps.Geocoder;
    this.markers = [];

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.9011, lng: -56.1645 },
      zoom: 15
    });
    this.PlaceDetailService = new google.maps.places.PlacesService(this.map);
  }


  updateSearchResults() {
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

  SubmitAddress() {
    Object.values(this.Address).forEach(field => {
      if(field == null){
        this.submitionValidationState = false;
      }
    });
    if(this.submitionValidationState){
      this.Address.floor = this.floor;
      console.log(this.Address);
        this.modalController.dismiss(this.Address);
    }
  }

  selectSearchResult(item) {
    this.autocompleteItems = [];
    this.SelectedAddressState = true;
    this.Address.street_number = null;
    this.Address.route = null;
    this.Address.locality = null;
    this.Address.administrative_area_level_1 = null;
    this.Address.country = null;
    this.Address.postal_code = null;

    let request = {
      placeId: item.place_id
    };
    this.PlaceDetailService.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < place.address_components.length; i++) {
          let addressType = place.address_components[i].types[0];
          console.log(addressType);

          switch (addressType) {
            case "street_number":
              this.Address.street_number = place.address_components[i]["long_name"];
              console.log(this.Address.street_number);
              break;
            case "route":
              this.Address.route = place.address_components[i]["long_name"];
              break;
            case "locality":
              this.Address.locality = place.address_components[i]["long_name"];
              break;
            case "administrative_area_level_1":
              this.Address.administrative_area_level_1 = place.address_components[i]["long_name"];
              break;
            case "country":
              this.Address.country = place.address_components[i]["long_name"];
              break;
            case "postal_code":
              this.Address.postal_code = place.address_components[i]["long_name"];
              break;
            default:
              break;
          }
        }
      }
      console.log(this.Address);
      this.Geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
        // console.log(results);
        if (status === 'OK' && results[0]) {
          let position = {
            lat: results[0].geometry.location.lat,
            lng: results[0].geometry.location.lng
          };
          this.Position = position;
          let marker = new google.maps.Marker({
            position: results[0].geometry.location,
            map: this.map,
          });
          this.markers.push(marker);
          this.map.setCenter(results[0].geometry.location);
        }
      });
      this.country = this.Address.country;
      this.city = this.Address.administrative_area_level_1;
      this.doorNumber = this.Address.street_number;
      this.region = this.Address.locality;
      this.address = this.Address.route
      this.postCode = this.Address.postal_code;
    });
    console.log(this.markers);
  }
}

