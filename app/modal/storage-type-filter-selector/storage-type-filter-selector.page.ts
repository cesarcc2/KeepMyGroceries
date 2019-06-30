import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-storage-type-filter-selector',
  templateUrl: './storage-type-filter-selector.page.html',
  styleUrls: ['./storage-type-filter-selector.page.scss'],
})
export class StorageTypeFilterSelectorPage implements OnInit {

  @Input() CurrentValue: number;
  DRY: boolean;
  REFRIGERATED: boolean;


  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.CurrentValue);
    this.FillCheckBoxes(this.CurrentValue);
  }

  FillCheckBoxes(CurrentValue) {
    switch (CurrentValue) {
      case 1:
        this.DRY = true;
        this.REFRIGERATED = false;
        break;
      case 2:
        this.DRY = false;
        this.REFRIGERATED = true;
        break;
      case 3:
        this.DRY = true;
        this.REFRIGERATED = true;
        break;
      case -1:
        this.DRY = false;
        this.REFRIGERATED = false;
        break;
    }
  }

  Cancel() {
    this.modalCtrl.dismiss({})
  }

  Submit() {
    this.modalCtrl.dismiss({
      'value': this.GetValue()
    })
  }

  GetValue() {

    let value: number;

    if (this.DRY == undefined) {
      this.DRY = false;
    } else if (this.REFRIGERATED == undefined) {
      this.REFRIGERATED = false;
    }

    if (this.DRY == true && this.REFRIGERATED == true) {
      value = 3;
    } else if (this.DRY == true && this.REFRIGERATED == false) {
      value = 1;
    } else if (this.DRY == false && this.REFRIGERATED == true) {
      value = 2;
    } else {
      value = -1;
    }

    return value;
  }

}
