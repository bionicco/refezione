import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'add-cantine',
    loadChildren: () => import('./pages/add-cantine/add-cantine.module').then( m => m.AddCantinePageModule)
  },
  {
    path: 'cantine-detail',
    loadChildren: () => import('./pages/cantine-detail/cantine-detail.module').then( m => m.CantineDetailPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
