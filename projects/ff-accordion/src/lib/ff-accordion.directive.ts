import {
  AfterViewInit,
  Directive,
  ElementRef, EventEmitter, HostBinding,
  Input, Output,
  OnInit, OnDestroy,
  NgZone,
  Renderer2, ChangeDetectorRef, ContentChild, HostListener
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FFResizeService} from './ff-resize.service';


@Directive({
  selector: 'ffAccordion , [ffAccordion]',
  exportAs: 'ffAccordion'
})
export class FFAccordionDirective implements AfterViewInit, OnInit, OnDestroy {
  private expand = new BehaviorSubject<boolean>(false);
  private _handler: () => void;
  private _opened: boolean = false;
  private listenMouseover: Function;
  private listenMouseout: Function;
  private listenClick: Function;

  get opened(): boolean {
    return this._opened;
  }

  @Input('ffAccordion')
  set opened(val: boolean) {
    this._opened = val;
    this.expand.next(this.opened);
  }

  @Input() disabled: boolean = false;

  @Output() expanded: EventEmitter<Boolean> = new EventEmitter();
  @Output() collapsed: EventEmitter<Boolean> = new EventEmitter();
  @ContentChild('trigger') private _trigger;
  @HostBinding('class.ff-expanded') private classExpanded = this.opened;

  private _resizeListener: BehaviorSubject<number> = new BehaviorSubject(0);
  private _scrollHeight;
  private hostEl;
  private trigger;

  constructor(private el: ElementRef,
              private _ngZone: NgZone,
              private renderer: Renderer2,
              private cdr: ChangeDetectorRef,
              private service: FFResizeService) {
  }

  private getHeight(element) {
    if (!element) {
      return 0;
    }
    const styles = window.getComputedStyle(element);
    const margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);

    return Math.ceil(element.offsetHeight + margin);
  }

  private getWidth(element) {
    if (!element) {
      return 0;
    }
    const styles = window.getComputedStyle(element);
    const margin = parseFloat(styles['marginRight']) + parseFloat(styles['marginLeft']);

    return Math.ceil(element.offsetWidth + margin);
  }

  public toggle = () => {
    if (this.disabled) {
      return;
    }
    this.opened = !this.opened;
    if (this.opened) {
      this.expanded.emit(this.opened);
      this.expand.next(this.opened);
    } else {
      this.collapsed.emit(this.opened);
    }
    this.setHeight();
  };

  private setListener() {
    this.service.addElemet(this.hostEl, (item) => {
      this._resizeListener.next(1);
    });
  }

  private setHeight() {
    if (!this.opened) {
      this.renderer.setStyle(this.hostEl, 'height', `${this.getHeight(this.trigger)}px`);
    } else {
      const height = this.hostEl.scrollHeight;
      /* const length = this.hostEl.children.length;

         for (let i = 0; i < length; i++) {
             height += this.getHeight(this.hostEl.children[i]);
           }*/
      this.renderer.setStyle(this.hostEl, 'height', `${height}px`);
    }
    this.classExpanded = this.opened;
  }

  private init() {
    this.trigger = (this._trigger && this._trigger.nativeElement) || this.hostEl.children[0];

    this._handler = () => {
      this.toggle();
    };

    this.listenClick = this.renderer.listen(this.trigger, 'click', this.toggle);
    this.listenMouseover = this.renderer.listen(this.trigger, 'mouseover', () => {
      this.renderer.addClass(this.trigger, 'ff-trigger-hover');
    });
    this.listenMouseout = this.renderer.listen(this.trigger, 'mouseout', () => {
      this.renderer.removeClass(this.trigger, 'ff-trigger-hover');
    });
  }

  ngOnDestroy(): void {
    this.service.removeElement(this.hostEl);
    this.listenClick();
    this.listenMouseout();
    this.listenMouseover();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.hostEl = this.el.nativeElement;
    const styles = window.getComputedStyle(this.hostEl);
    const display = styles['display'];
    const direction = styles['flexDirection'];
    const alignItems = styles['alignItems'];
    if ((display === 'flex' || display === 'inline-flex') && (alignItems === 'normal' || alignItems === 'stretch')) {
      throw new Error('Css property align-items must not be "normal" (as default) or "stretch" at the flex element');
    }
    if ((display === 'flex' || display === 'inline-flex') && (direction === 'column' || direction === 'column-reverse')) {
      throw new Error('Css property flex-direction must not be "column" or "column-reverse" at the flex element');
    }

    this.renderer.setStyle(this.hostEl, 'overflow', 'hidden');
    this._scrollHeight = this.hostEl.scrollHeight;
    this.init();
    this.expand.subscribe(flag => {
      flag ? this.renderer.addClass(this.trigger, 'ff-trigger-active') : this.renderer.removeClass(this.trigger, 'ff-trigger-active');
      this.setHeight();
    });
    this._resizeListener.subscribe((h) => {
      this.setHeight();
    });
    this.setListener();
    this.cdr.detectChanges();
  }
}
