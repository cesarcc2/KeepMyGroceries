import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreatePostPage } from './create-post.page';
import { CreatePostHelpComponent } from '../create-post-help/create-post-help.component';
// import { AddressPickerPageModule } from '../modal/address-picker/address-picker.module';

const routes: Routes = [
  {
    path: '',
    component: CreatePostPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    CreatePostHelpComponent
    // AddressPickerPageModule
 ],
  declarations: [CreatePostPage,CreatePostHelpComponent],
  entryComponents: [
    CreatePostHelpComponent
    // AddressPickerPageModule
]
})
export class CreatePostPageModule {}
