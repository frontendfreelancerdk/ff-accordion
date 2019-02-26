import { NgModule } from '@angular/core';
import {FFResizeService} from './ff-resize.service';
import {FFAccordionDirective} from './ff-accordion.directive';

@NgModule({
  declarations: [FFAccordionDirective],
  imports: [],
  exports: [FFAccordionDirective],
  providers: [FFResizeService]
})
export class FfAccordionModule { }
