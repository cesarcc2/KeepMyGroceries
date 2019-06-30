import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PostDetailsHostPage } from './post-details-host.page';

const routes: Routes = [
  {
    path: '',
    component: PostDetailsHostPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PostDetailsHostPage]
})
export class PostDetailsHostPageModule {}
