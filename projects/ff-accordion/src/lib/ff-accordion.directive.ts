import {
  AfterViewInit,
  Directive,
  ElementRef, EventEmitter, HostBinding,
  Input, Output,
  OnInit, OnDestroy,
  NgZone,
  Renderer2, ChangeDetectorRef, ContentChild, Inject, PLATFORM_ID
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FFResizeService} from './ff-resize.service';
import {isPlatformBrowser} from '@angular/common';


@Directive({
  selector: 'ffAccordion , [ffAccordion]',
  exportAs: 'ffAccordion'
})
export class FFAccordionDirective implements AfterViewInit, OnInit, OnDestroy {
  private expand = new BehaviorSubject<boolean>(false);
  private _handler: () => void;
  private _opened = false;
  private listenMouseover: Function;
  private listenMouseout: Function;
  private listenClick: Function;

  get opened() {
    return this._opened;
  }

  @Input('ffAccordion')
  set opened(val) {
    this._opened = val;
    this.expand.next(this.opened);
  }

  @Input() disabled = false;

  @Output() expanded: EventEmitter<Boolean> = new EventEmitter();
  @Output() collapsed: EventEmitter<Boolean> = new EventEmitter();
  @ContentChild('trigger', {static: false}) private _trigger;
  @HostBinding('class.ff-expanded') private classExpanded = this.opened;

  private _resizeListener: BehaviorSubject<number> = new BehaviorSubject(0);
  private _scrollHeight;
  private hostEl;
  private trigger;

  constructor(private el: ElementRef,
              private _ngZone: NgZone,
              private renderer: Renderer2,
              private cdr: ChangeDetectorRef,
              private service: FFResizeService,
              @Inject(PLATFORM_ID) private platformId: any) {
  }

  private getHeight(element) {
    if (!element || !isPlatformBrowser(this.platformId)) {
      return 0;
    }
    const styles = window.getComputedStyle(element);
    const margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);

    return Math.ceil(element.offsetHeight + margin);
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
    this.service.addElemet(this.hostEl, () => {
      this._resizeListener.next(1);
    });
  }

  private setHeight() {
    if (!this.opened) {
      this.renderer.setStyle(this.hostEl, 'height', `${this.getHeight(this.trigger)}px`);
    } else {
      this.renderer.setStyle(this.hostEl, 'height', `${this.hostEl.scrollHeight}px`);
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
    if (isPlatformBrowser(this.platformId)) {
      this.service.removeElement(this.hostEl);
      typeof this.listenClick === 'function' && this.listenClick();
      typeof this.listenMouseout === 'function' && this.listenMouseout();
      typeof this.listenMouseover === 'function' && this.listenMouseover();
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && window && typeof window.getComputedStyle === 'function') {
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
      this._resizeListener.subscribe(() => {
        this.setHeight();
      });
      this.setListener();
      this.cdr.detectChanges();
    }

  }
}
