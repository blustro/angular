import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyFormComponent } from './my-form.component';

@NgModule({
  declarations: [MyFormComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    MyFormComponent
  ]
})
export class MyFormModule { }
