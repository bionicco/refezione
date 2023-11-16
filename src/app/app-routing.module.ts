import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'add-canteen',
    loadChildren: () => import('./pages/add-canteen/add-canteen.module').then(m => m.AddCanteenPageModule)
  },
  {
    path: 'canteen-detail',
    loadChildren: () => import('./pages/canteen-detail/canteen-detail.module').then(m => m.CanteenDetailPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
