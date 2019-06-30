import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-post-help',
  templateUrl: './create-post-help.component.html',
  styleUrls: ['./create-post-help.component.scss'],
})
export class CreatePostHelpComponent implements OnInit {

  constructor() { }
  element;
  information: string;
  ngOnInit() {
    console.log(this.element);
    let information: any;
    switch (this.element) {
      case 'homedelivery':
        this.information = 'Check this option if you deliver the items at the client\'s home.'
        break;
      case 'storageprivacy':
        this.information = 'Check this option if you keep the client\'s items separated from the other client\'s items'
        break;
      default:
        break;
    }

  }

}
