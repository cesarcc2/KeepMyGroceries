import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DBService } from '../services/db.service';
import { Router } from '@angular/router';
import { PopoverController, LoadingController, Platform, ActionSheetController, ToastController, ModalController } from '@ionic/angular';
import { CreatePostHelpComponent } from '../create-post-help/create-post-help.component';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { HttpClient } from '@angular/common/http';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { environment, Server } from '../../environments/environment';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { AddressPickerPage } from '../modal/address-picker/address-picker.page';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
  providers: [FileTransfer, FileTransferObject]
})
export class CreatePostPage implements OnInit {
  BaseURL: string = Server;
  public createPost: FormGroup;
  warningMessage: string;
  images = [];

  constructor(private DB: DBService, private http: HttpClient, private router: Router, public formBuilder: FormBuilder,
    public popoverController: PopoverController, public loadingController: LoadingController, private camera: Camera,
    private plt: Platform, private filePath: FilePath, private file: File,
    private actionSheetController: ActionSheetController, private toastController: ToastController, private webview: WebView,
    private transfer: FileTransfer, private objectTransfer: FileTransferObject, private modalController: ModalController) {

    this.createPost = formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      homedelivery: [''],
      storageprivacy: [''],
      storagesize: ['', Validators.required],
      storagetype: ['', Validators.required],
    });
  }

  async presentPopover(text: any) {
    const popoverElement = await this.popoverController.create({
      component: CreatePostHelpComponent,
      event: event,
      componentProps: { element: text, popoverController: this.popoverController }
    });
    return await popoverElement.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Setting things up',
      spinner: "crescent"
    });
    await loading.present();
  }

  async openAddressPickerModal() {
    if (this.createPost.invalid) {
      this.warningMessage = 'Fields left unfilled';
    } else {
      const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: AddressPickerPage,
      });

    modal.onDidDismiss().then((data) => {
      console.log(data);
      this.Submit(data['data']);
    });

    await modal.present();
    }
  }

  ngOnInit() {

  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      }]
    });
    await actionSheet.present();
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      targetWidth: 300,
      targetHeight: 300,
      sourceType: sourceType,
      saveToPhotoAlbum: false
    };

    this.camera.getPicture(options).then(imagePath => {
      if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());

      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    });

  }

  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {

      let filePath = this.file.dataDirectory + newFileName;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
        name: newFileName,
        path: resPath,
        filePath: filePath
      };
      this.images = [newEntry, ...this.images];
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  startUpload(imgEntry, PostId) {
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: imgEntry['name'],
      params: {
        id: PostId
      }
    }

    this.objectTransfer.upload(imgEntry['filePath'], encodeURI(this.DB.BaseURL + "/postmedia/create"), options, true)
      .then((data) => {
        console.log(data);
      }, (err) => {
      });
  }

  Submit(Address) {
    if (this.createPost.invalid) {
      this.warningMessage = 'Fields left unfilled';
    } else {
      this.warningMessage = '';
      let country = Address['country'];
      let address = Address['route'];
      let floor = Address['floor'];
      let doornumber = Address['street_number'];
      let city = Address['administrative_area_level_1'];
      let region = Address['locality'];
      let postcode = Address['postal_code'];
      let title = this.createPost.value['title'];
      let description = this.createPost.value['description'];
      let homedelivery = this.createPost.value['homedelivery'];
      let storageprivacy = this.createPost.value['storageprivacy'];
      let storagesize = this.createPost.value['storagesize'];
      let storagetype = this.createPost.value['storagetype'];

      homedelivery = homedelivery !== false ? 1 : 0;
      storageprivacy = storageprivacy !== false ? 1 : 0;

      if (!this.DB.Me) {
        console.log("not logged in");
      } else {
        let host = this.DB.Me.id;
        let Address = {
          'address': address,
          'doorNumber': doornumber,
          'postcode': postcode,
          'city': city
        }

        this.DB.GetLatandLong(Address)
          .then((coordinates) => {
            this.DB.CreatePostAddress(country, address, postcode, floor, doornumber, city, region, coordinates['0'], coordinates['1']).then((addressID) => {
              this.DB.CreatePost(title, description, addressID, homedelivery, storageprivacy, storagesize, storagetype, host).then((PostId) => {
                if (this.images) {
                  for (let i = 0; i < this.images.length; i++) {
                    this.images[i]['name'] = "Post-" + PostId + "-" + Date.now() + ".jpg";
                    this.startUpload(this.images[i], PostId);
                  }
                  this.router.navigate(['/main/tab2']);
                } else {
                  this.router.navigate(['/main/tab2']);
                }
              });
            });
          })
          .catch((error) => {
            this.warningMessage = "Invalid Address";
          });
      }
    }
  }

}
