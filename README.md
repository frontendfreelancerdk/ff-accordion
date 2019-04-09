[![Build Status](https://travis-ci.org/frontendfreelancerdk/ff-accordion.svg?branch=master)](https://travis-ci.org/frontendfreelancerdk/ff-accordion)

# ff-accordion

##Getting started

### Installation

#####To install this library, run:

```bash
$ npm install ff-accordion --save
```

##### Include to your module
 `AppModule`

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import library
import {FfAccordionModule} from 'ff-accordion';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // Specify library as an import
    FfAccordionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once ff-accordion is imported, you can use its directive in your Angular application:

```xml
<!-- You can now use your library directive in your.component.html -->
<div ffAccordion class="myAccordion">
  ...
</div>
```

But the main structure must be:

```xml
<!-- your accordion wrapper with directive -->
<div ffAccordion class="yourAccordionCssClass">
  <!-- The first should be your trigger (button for toggle) -->
  <!-- it can be any html element (e.g button, p, div, span, ect) -->
  <p class="yourAccordionBtnCssClass">Trigger</p>
    <!-- The second should be your content -->
    <!-- it also can be any html element -->
    <ul class="yourAccordionContentCssClass">
      <li><a href="#1">Link 1</a></li>
      <li><a href="#2">Link 2</a></li>
      <li><a href="#3">Link 3</a></li>
      <li><a href="#4">Link 4</a></li>
    </ul>
</div>
```

## API

Selector: simple `ffAccordion` and `[ffAccordion]` with binding.  
Exported as: `ffAccordion`  

#### Properties
```typescript
  @Input('ffAccordion') opened: boolean = false;
```
> The [ffAccordion] attribute binding both applies the ffAccordion directive
> to the your accordion and sets the directive's default state (opened/closed)
> with a property binding.  By default it's false

```typescript
  @Input() disabled: boolean = false;
```
>  The [disabled] attribute binding disabling toggle. By default it's false

```typescript
  @Output() expanded: EventEmitter<Boolean>;
```
> Event expanded triggers when accordion was expanded

```typescript
  @Output() collapsed: EventEmitter<Boolean>;
```
> Event collapsed triggers when accordion was collapsed


#### Methods
```typescript
  toggle(): void 
```
> You can call this method to toggle current state of accordion (opened/closed)

#### Styles
`css`
```css
.ff-expanded{
 /* Your accordion will have this class when it is expanded*/
}

.ff-trigger-hover{
 /* Your trigger will have this class when hover */
}

.ff-trigger-active{
 /* Your trigger will have this class when this accordion is expanded */
}
```

## Examples

### Simple usage
`html`
```html
<div ffAccordion class="myAccordion">
  <!-- HINT! Trigger must be first child of accordion or you have to use 
  Template reference variable ( #trigger ) but more on that below -->
  <div class="myAccordionBtn"><span class="chevron"></span> Trigger </div>
  <!-- HINT! Content must be second child of accordion -->
  <ul class="myAccordionContent">
    <li><a href="#1">item 3-1</a></li>
    <li><a href="#2">item 3-2</a></li>
    <li><a href="#3">item 3-3</a></li>
    <li><a href="#4">item 3-4</a></li>
  </ul>
</div>
```

`css`
```css
.myAccordion{
 /* Your styles for accordion wrapper, e.g margin */
 /* HINT! it must not be with property flex-direction: column 
 and align-items: stretch (or normal)*/
 /* HINT! For transition add css property transition for height*/
  transition: height 0.5s ease;
}

.myAccordionBtn{
 /* Your styles for accordion trigger, e.g color, font size, background, ect.*/
}

.myAccordionContent{
 /* Your styles for content wrapper*/
}
```

### Usage with template reference variable
`html`
```html
<div ffAccordion class="myAccordion">
  <div class="someWrapper">
    <span>Lorem</span>
    <span>Ipsum</span>
    <!-- HINT! 
    Now click on first child (div.someWrapper) won't call toggle() method.
    Instead it will be called by click on element with template variable
    #trigger inside your accordion -->
    <span class="myAccordionBtn" #trigger>Trigger</span>
  </div>
  <ul class="myAccordionContent">
    <li><a href="#1">item 3-1</a></li>
    <li><a href="#2">item 3-2</a></li>
    <li><a href="#3">item 3-3</a></li>
    <li><a href="#4">item 3-4</a></li>
  </ul>
</div>
```

### toggle() method
Export directive to template variable then use it where you need

`html`
```html
<div ffAccordion #myVar="ffAccordion" class="myAccordion">
  <p class="myAccordionBtn"><span class="chevron"></span> Trigger </p>
  <ul class="myAccordionContent">
    <li><a href="#1">item 1-1</a></li>
    <li><a href="#2">item 1-2</a></li>
    <li><a href="#3">item 1-3</a></li>
    <li><a href="#4">item 1-4</a></li>
  </ul>
</div>

<button (click)="myVar.toggle()">Toggle</button>
``` 

### Multiple accordion
`html`
```html
<div [ffAccordion]="index === 0" class="myAccordion" [disabled]="index === 0"
     (expanded)="index=0">
  <p class="myAccordionBtn"><span class="chevron"></span> Multiple accordion 1</p>
  <div class="myAccordionContent">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium
       aliquam architecto asperiores autem dicta omnis perferendis quisquam
       voluptatum. Ab at cum debitis dolores explicabo fugit nam quibusdam rem 
       tempora, voluptatibus?</p>
  </div>
</div>

<div [ffAccordion]="index === 1" class="myAccordion" [disabled]="index === 1"
     (expanded)="index=1">
  <p class="myAccordionBtn"><span class="chevron"></span> Multiple accordion 2 </p>
  <div class="myAccordionContent">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium
       aliquam architecto asperiores autemv dicta omnis perferendis quisquam 
       voluptatum. Ab at cum debitis dolores explicabo fugit nam quibusdam rem 
       tempora, voluptatibus?</p>
  </div>
</div>

<div [ffAccordion]="index === 2" class="myAccordion" [disabled]="index === 2"
     (expanded)="index=2">
  <div class="myAccordionBtn"><span class="chevron"></span> Multiple accordion 3</div>
  <div class="myAccordionContent">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium
       aliquam architecto asperiores autem dicta omnis perferendis quisquam 
       voluptatum. Ab at cum debitis dolores explicabo fugit nam quibusdam rem 
       tempora, voluptatibus?</p>
  </div>
</div>
```
`typescript`
```typescript
import ...

@Component({
  ...
})
export class YourComponent {
  index = 0;
}
```
## License

MIT © [Frontend Freelancer](mailto:developer@frontend-freelancer.com)
