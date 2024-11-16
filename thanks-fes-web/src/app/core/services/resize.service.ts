export class ResizeService {
  isWindowSmall = false;
  element: HTMLElement;
  callback: () => void;

  get windowWidth() {
    return window.innerWidth;
  }
  get windowHeight() {
    return window.innerHeight;
  }
  get targetWidth() {
    return this.element?.clientWidth || 0;
  }
  get targetHeight() {
    return this.element?.clientHeight || 0;
  }

  constructor(element?: HTMLElement, callback?: () => void) {
    this.element = element;
    this.callback = callback;
    (this.element || window).addEventListener('resize', () => {
      this.resize();
      callback();
    });
    this.resize();
  }

  resize() {
    this.isWindowSmall = this.windowWidth < 500;
  }

  clear() {
    (this.element || window).removeEventListener('resize', this.callback);
  }
}
