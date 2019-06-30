import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-storage-size-filter-selector',
  templateUrl: './storage-size-filter-selector.page.html',
  styleUrls: ['./storage-size-filter-selector.page.scss'],
})
export class StorageSizeFilterSelectorPage implements OnInit {

  @Input() CurrentValue: number;
  StorageSizeRadioGroup;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.FillCheckBoxes(this.CurrentValue);
  }

  FillCheckBoxes(CurrentValue) {
    switch (CurrentValue) {
      case -1:
        break;
      case 1:
        this.StorageSizeRadioGroup = "1";
        break;
      case 2:
        this.StorageSizeRadioGroup = "2";
        break;
      case 3:
        this.StorageSizeRadioGroup = "3";
        break;
      case 4:
        this.StorageSizeRadioGroup = "4";
        break;
    }
  }

  Cancel() {
    this.modalCtrl.dismiss({})
  }

  Submit() {
    this.modalCtrl.dismiss({
      'value': this.GetValue(+this.StorageSizeRadioGroup)
    })
  }

  GetValue(StorageSizeRadioGroup: number) {

    let value: number;

    switch (StorageSizeRadioGroup) {
      case 1:
        value = 1;
        break;
      case 2:
        value = 2;
        break;
      case 3:
        value = 3;
        break;
      case 4:
        value = 4;
        break;
      default:
        value = -1;
        console.log("aa");
        break;
    }
    return value;
  }

}
