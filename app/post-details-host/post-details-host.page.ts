import { Component, OnInit, Input, ViewChild, AfterViewChecked } from '@angular/core';
import { DBService } from '../services/db.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Post } from '../models/post';
import { PopoverController, LoadingController, Platform, ActionSheetController, ToastController } from '@ionic/angular';
import { environment, Server } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { IonSlides } from '@ionic/angular'
import { SlotsList } from '../models/slotsList';
import { Slot } from '../models/slot';


@Component({
  selector: 'app-post-details-host',
  templateUrl: './post-details-host.page.html',
  styleUrls: ['./post-details-host.page.scss'],
  providers: [FormBuilder, FileTransfer, FileTransferObject]
})

export class PostDetailsHostPage implements OnInit {
  @ViewChild('datePickerDayBegin') datePickerStartingDay;
  @ViewChild('datePickerDayEnd') datePickerEndingDay;
  @ViewChild('datePickerHourBegin') datePickerStartingHour;
  @ViewChild('datePickerHourEnd') datePickerEndingHour;
  @ViewChild('slider', { read: IonSlides }) slider: IonSlides;

  constructor(private router: Router, private DB: DBService, public Route: ActivatedRoute, private camera: Camera,
    private filePath: FilePath, private file: File, private actionSheetController: ActionSheetController,
    private webview: WebView, private transfer: FileTransfer, private objectTransfer: FileTransferObject,
    private plt: Platform, private toastController: ToastController, public formBuilder: FormBuilder) { }


  Server: string = Server;
  Post: Post;

  //  variables for storage tab //
  tabs: string = 'storage';
  EditState: boolean = false;
  ImgSrcDefault: string = "../assets/img/noImage.png";
  swiperParams = {
    touchStartPreventDefault: false
  }

  //variables for schedule tab //

  SlotsList: SlotsList;
  Slot: Slot;
  StartingDay: Date = new Date();
  EndingDay: Date = new Date();
  StartingHour: Date = new Date();
  EndingHour: Date = new Date();
  Title: string = "Define your availability";
  currentDate = new Date();
  day = this.currentDate.getDate();
  month = this.getMonth((this.currentDate.getMonth()) + 1);
  year = this.currentDate.getFullYear();
  min = this.day + "-" + this.month + "-" + this.year;
  SlotToEdit: number;
  LimiterDatePickerDelivery = 1;




  ngOnInit() {
    this.DB.GetMyPosts().then((result) => {
      this.Post = this.DB.MyPosts.GetPostByID(this.Route.snapshot.paramMap.get("post"));
      console.log(this.Post);
      this.SlotsList = new SlotsList();
      this.SlotsList = this.Post.SlotList;
    });
  }

  ionViewDidEnter() {
    if (this.Route.snapshot.paramMap.get("slider")) {
      this.slider.slideTo(+this.Route.snapshot.paramMap.get("slider"));
    }
  }

  SlideChange() {
    this.slider.getActiveIndex().then((index) => {
      if (index == 0) { this.tabs = 'storage'; } else { this.tabs = 'schedule'; }
    });
  }

  TabChange(event) {
    let slider = event.detail.value
    if (slider == 'storage') {
      this.slider.slideTo(0);
    } else {
      this.slider.slideTo(1);
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

  async Addimage() {
    if (this.EditState == true) {
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
      this.startUpload(newEntry, this.Post.id)
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
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
        this.ngOnInit();
      }, (err) => {
      });
  }

  deleteImage(mediaID, ImageName) {
    console.log(mediaID);
    console.log(ImageName);
    this.DB.DeletePostMedia(mediaID, ImageName).then(() => {
      this.ngOnInit();
    });
  }

  EditToggle() {
    this.EditState = this.EditState == false ? true : false;
    if (this.EditState == true) {
      this.ImgSrcDefault = "../assets/img/newPostPhoto.png";
    } else {
      this.ImgSrcDefault = "../assets/img/noImage.png";
      // this.DB.updatePost();
    }
  }






  // ------------------ FUNCTIONS FOR SCHEDULE TAB ---------------- //

  getMonth(month) {
    return month < 10 ? '0' + month : '' + month;
  }

  async presentActionSheet(index, Slot) {
    this.RemoveSlot(index, Slot);
  }


  DatePickerChange(data, slotx) {
    let field = data.path['0'].id;
    let slot = slotx;
    let value = data.detail.value;
    let valueDateFormat = new Date (data.detail.value);
    console.log(this.SlotsList['SlotsList']);
    let editSlot: Slot = this.SlotsList['SlotsList'][slot];
    console.log(editSlot);
    console.log(value);

    switch (field) {
      case 'datePickerDayBegin':
        editSlot.SetDayBegin(value.substring(0, value.indexOf('T')));
        this.SlotsList[slot] = editSlot;
        this.LimiterDatePickerDelivery = valueDateFormat.getDate();
        break;
      case 'datePickerDayEnd':
        editSlot.SetDayEnd(value.substring(0, value.indexOf('T')));
        this.SlotsList[slot] = editSlot;
        break;
      case 'datePickerHourBegin':
        editSlot.SetHourBegin(value.substring(value.indexOf("T") + 1));
        this.SlotsList[slot] = editSlot;
        break;
      case 'datePickerHourEnd':
        editSlot.SetHourEnd(value.substring(value.indexOf("T") + 1));
        this.SlotsList[slot] = editSlot;
        break;
    }
  }

  AddSlot() {
    this.Slot = new Slot();
    this.SlotsList.AddSlot(this.Slot);
    this.SlotToEdit = this.SlotsList.NumberOfSlots() - 1;
    this.LimiterDatePickerDelivery = 1;
  }

  RemoveSlot(index, Slot) {
    this.SlotsList.RemoveSlot(index);
    if (this.SlotsList.NumberOfSlots() == 0) {
      this.DB.ToggleActivatePost(this.Post.id, 't');

    }

  }


  SubmitSlots() {
    let validation: boolean = true;
    let SlotRegist = [];
    for (let line = 0; line < this.SlotsList.NumberOfSlots(); line++) {
      let editSlot: Slot = this.SlotsList['SlotsList'][line];

      if (editSlot.isValidForSubmition() == false) {
        validation = false;
      }

    }


    if (validation) {

      SlotRegist.push(this.SlotsList['SlotsList']);
      SlotRegist.push(this.Post.id);
      SlotRegist.push(this.day + "-" + this.month + "-" + this.year);
      console.log(SlotRegist);
      this.DB.InsertSlots(SlotRegist);
      if (this.SlotsList.NumberOfSlots() == 0) {
        this.DB.ToggleActivatePost(this.Post.id, 't').then((data) => {
        });
      } else {
        this.DB.ToggleActivatePost(this.Post.id, 'f').then((data) => {
        });
      }



    } else {
      console.log(SlotRegist);
      this.DB.ToggleActivatePost(this.Post.id, 't').then((data) => {
      });
    }

  }

  enableEditing(index) {
    if (this.SlotToEdit == index) {
      this.SlotToEdit = undefined;
    } else {
      this.SlotToEdit = index;
    }
  }


}
