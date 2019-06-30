import { Component, OnInit, ViewChild } from '@angular/core';
import { DBService } from '../services/db.service';
import { Router } from '@angular/router';
import { Camera, CameraOptions,PictureSourceType } from '@ionic-native/camera/ngx';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ModalController, ToastController, ActionSheetController,Platform } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File,FileEntry } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { OrdersList } from '../models/ordersList';
import { IonSlides } from '@ionic/angular'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers: [FileTransferObject]
})
export class Tab2Page {

  @ViewChild('sliders') slider: IonSlides; 
  public updateHostDataForm: FormGroup;

  constructor(private DB:DBService,  private objectTransfer:FileTransferObject, private actionSheetController: ActionSheetController,private file: File,private plt:Platform,private webview: WebView,private router:Router,public formBuilder: FormBuilder,private camera: Camera,public modalController: ModalController,public toastController: ToastController){
    this.updateHostDataForm = formBuilder.group({
      phoneNumber: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
  tabs="storages";
  SelectedPost:number;
  image:string = "assets/img/defaultthumbnail.png";
  tmpImage:any;
  State:boolean;
  warningMessage:string;
  Me = this.DB.Me;
  Posts;
  Orders;

  async ShowToast(Message) {
    const toast = await this.toastController.create({
      message: Message,
      showCloseButton: true,
      position: 'top',
    });
    toast.present();
  }

  ngOnInit(){
    this.State = this.DB.checkHostState();
    this.loadMyData();
  }

  Select(postSelected){
    this.SelectedPost = postSelected == this.SelectedPost ? this.SelectedPost=0 : this.SelectedPost=postSelected;
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
          targetWidth:300,
          targetHeight:300,
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
          this.tmpImage = newEntry;
          this.image = newEntry.path;
      }, error => {
          this.presentToast('Error while storing file.');
      });
  }

  startUpload(imgEntry,PostId) {
  let options: FileUploadOptions = {
    fileKey: 'file',
    fileName: imgEntry['name'],
    params: {
      id: PostId
    }
  }

    this.objectTransfer.upload(imgEntry['filePath'], encodeURI(this.DB.BaseURL + "/postmedia/create"),  options, true)
    .then((data) => {
      //Continue Code
    }, (err) => {
    });
  }



  SubmitHostData(){
    if (this.updateHostDataForm.invalid || this.image == undefined) {
      this.warningMessage = 'Unfilled data';
    }else{
      this.warningMessage = null;

      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: this.tmpImage['name'],
        params: {
          id: this.DB.Me.id,
          phoneNumber: this.updateHostDataForm.value['phoneNumber'],
          description: this.updateHostDataForm.value['description']
        }
      }

      this.objectTransfer.upload(this.tmpImage['filePath'], encodeURI(this.DB.BaseURL + "/client/update/hostdata/" + this.DB.Me.id),  options, true)
      .then((data) => {
          this.DB.Me.phoneNumber = this.updateHostDataForm.value['phoneNumber'];
          this.DB.Me.description = this.updateHostDataForm.value['description'];
          this.DB.Me.photo = this.tmpImage['path'];
          this.DB.Me.role = 3;
          this.ngOnInit();
      }, (err) => {
      });
    }
  }

  loadMyData(){
    this.DB.GetMyPosts().then((data)=>{
      this.Posts = this.DB.MyPosts.GetAll();
      this.DB.GetMyOrders().then((data)=>{
        this.Orders = this.DB.MyOrders.GetAll();
        console.log(this.Orders);
      }).catch(err=>console.log("No Orders"))
    }).catch(err=>console.log("No Posts"))
  }

  ActivatePost(post){
    this.router.navigate(['post-details-host/'+ post.id +'/' + 1]);
    }

    DeletePost(Post){
      if (Post.orders !== []){
        this.ShowToast("Post cant be deleted because it has orders");
      }else{
        this.DB.DeletePost(Post.id).then(()=>{
          this.loadMyData();
        });
      }
    }

    doRefresh(event) {
      this.loadMyData();  
      setTimeout(() => {
        event.target.complete();
      }, 500);
    }

    SlideChange(){
      this.slider.getActiveIndex().then((index)=>{
        if(index == 0){this.tabs='storages';}else{this.tabs='orders';}
      });

    }

    TabChange(event){
     let slider = event.detail.value
     if(slider=='storages'){
      this.slider.slideTo(0);
     }else{
       this.slider.slideTo (1);
     }
    }

  }











