import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LibsSearchComponent } from './libs-search/libs-search.component';

const routes: Routes = [{ path: '', component: LibsSearchComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReactiveSearchRoutingModule {}
