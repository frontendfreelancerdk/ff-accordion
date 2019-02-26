import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {FfAccordionModule} from 'ff-accordion';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FfAccordionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
