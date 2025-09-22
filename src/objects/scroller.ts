export class ScrollerElement {
  constructor(
    private element: HTMLElement,
    private scrollError = 0
  ) {}

  public get scrollWidth(): number {
    return this.element.scrollWidth;
  }

  public get scrollHeight(): number {
    return this.element.scrollHeight;
  }

  public get scrollLeft(): number {
    return this.element.scrollLeft;
  }

  public get scrollTop(): number {
    return this.element.scrollTop;
  }

  public get clientWidth(): number {
    return this.element.clientWidth;
  }

  public get clientHeight(): number {
    return this.element.clientHeight;
  }

  public get verticalStart(): boolean {
    return this.scrollTop === 0;
  }

  public get verticalEnd(): boolean {
    return (
      this.scrollTop + this.clientHeight >= this.scrollHeight - this.scrollError
    );
  }

  public get verticalPercentage(): number {
    return (this.scrollTop / this.scrollHeight - this.clientHeight) * 100;
  }

  public get horizontalStart(): boolean {
    return this.scrollLeft === 0;
  }

  public get horizontalEnd(): boolean {
    return (
      this.scrollLeft + this.clientWidth >= this.scrollWidth - this.scrollError
    );
  }

  public get horizontalPercentage(): number {
    return (this.scrollLeft / this.scrollWidth - this.clientWidth) * 100;
  }
}
