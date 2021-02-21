import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveSearchRoutingModule } from './reactive-search-routing.module';
import { LibsSearchComponent } from './libs-search/libs-search.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LibsSearchComponent],
  imports: [CommonModule, ReactiveSearchRoutingModule, ReactiveFormsModule],
})
export class ReactiveSearchModule {}
