import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full'  },
  { path: 'main', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'post-details/:post', loadChildren: './post-details/post-details.module#PostDetailsPageModule' },
  { path: 'create-post', loadChildren: './create-post/create-post.module#CreatePostPageModule' },
  { path: 'use-service/:post', loadChildren: './use-service/use-service.module#UseServicePageModule'},
  { path: 'start', loadChildren: './start/start.module#StartPageModule' },
  { path: 'storage-type', loadChildren: './modal/storage-type/storage-type.module#StorageTypePageModule' },
  { path: 'post-details-host/:post/:slider', loadChildren: './post-details-host/post-details-host.module#PostDetailsHostPageModule' },
  { path: 'storage-type-filter-selector', loadChildren: './modal/storage-type-filter-selector/storage-type-filter-selector.module#StorageTypeFilterSelectorPageModule' },
  { path: 'storage-size-filter-selector', loadChildren: './modal/storage-size-filter-selector/storage-size-filter-selector.module#StorageSizeFilterSelectorPageModule' },
  { path: 'address-picker', loadChildren: './modal/address-picker/address-picker.module#AddressPickerPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
