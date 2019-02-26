import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FFResizeService {
  _listening = false;
  requestAnimationFrame;
  elements: any[] = [];

  constructor() {
    this.requestAnimationFrame = window.requestAnimationFrame ||
      (window as any).mozRequestAnimationFrame ||
      (window as any).webkitRequestAnimationFrame ||
      function (fn) {
        return window.setTimeout(fn, 20);
      };
  }

  getScrollSize(element) {
    if (!element) {
      return;
    }
    return {
      height: Math.round(element.scrollHeight),
      width: Math.round(element.scrollWidth)
    };
  }

  getElementSize(element) {
    if (!element) {
      return;
    }
    if (!element.getBoundingClientRect) {
      return {
        height: element.offsetHeight,
        width: element.offsetWidth
      };
    }

    const rect = element.getBoundingClientRect();
    return {
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
  }

  addElemet(element, callback, scroll = false, deep = false) {
    for (let i = 0, len = this.elements.length; i < len; i++) {
      if (this.elements[i] && this.elements[i].element === element) {
        if (this.elements[i].callback.toString() === callback.toString()) {
          this.elements[i].callback = callback;
        } else {
          return;
        }
      }
    }
    this.elements.push({element, callback, scroll, size: scroll ? this.getScrollSize(element) : this.getElementSize(element)});
    if (!this._listening) {
      this.start();
    }
  }

  removeElement(element) {
    for (let i = 0, len = this.elements.length; i < len; i++) {
      if (this.elements[i] && this.elements[i].element === element) {
        this.elements.splice(i, 1);
      }
    }
  }


  start() {
    this.requestAnimationFrame(() => {
      if (!this.elements.length) {
        this._listening = false;
        return;
      }
      this._listening = true;
      for (let i = 0, len = this.elements.length; i < len; i++) {
        const newSizes = this.elements[i].scroll ? this.getScrollSize(this.elements[i].element) : this.getElementSize(this.elements[i].element);
        const previousSize = Object.assign({}, this.elements[i].size);
        const type = this.checkDifference(previousSize, newSizes);
        if (type !== 'none') {
          this.elements[i].size = newSizes;
          this.elements[i].callback({type, previous: previousSize, current: newSizes, item: this.elements[i]});
        }
      }
      this.start();
    });
  }

  checkDifference(previous, current) {
    let type = 'none';
    if (previous.height !== current.height && previous.width !== current.width) {
      type = 'both';
    } else if (previous.width !== current.width) {
      type = 'width';
    } else if (previous.height !== current.height) {
      type = 'height';
    }
    return type;
  }

}
