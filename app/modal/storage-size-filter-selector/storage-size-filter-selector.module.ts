import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StorageSizeFilterSelectorPage } from './storage-size-filter-selector.page';

const routes: Routes = [
  {
    path: '',
    component: StorageSizeFilterSelectorPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StorageSizeFilterSelectorPage]
})
export class StorageSizeFilterSelectorPageModule {}
