import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FFAccordionModule} from 'ff-accordion';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FFAccordionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
