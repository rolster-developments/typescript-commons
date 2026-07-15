import { ScrollerElement } from './scroller';

function createMockElement(
  overrides: Partial<Record<keyof HTMLElement, number>> = {}
): HTMLElement {
  const element = document.createElement('div');

  const descriptors: PropertyDescriptorMap & {
    [key: string]: PropertyDescriptor;
  } = {
    scrollWidth: { value: 1000, configurable: true },
    scrollHeight: { value: 2000, configurable: true },
    scrollLeft: { value: 0, configurable: true },
    scrollTop: { value: 0, configurable: true },
    clientWidth: { value: 500, configurable: true },
    clientHeight: { value: 500, configurable: true }
  };

  for (const key in overrides) {
    descriptors[key] = { value: overrides[key], configurable: true };
  }

  Object.defineProperties(element, descriptors);

  return element;
}

describe('ScrollerElement', () => {
  it('should return scroll dimensions', () => {
    const element = createMockElement();
    const scroller = new ScrollerElement(element);

    expect(scroller.scrollWidth).toBe(1000);
    expect(scroller.scrollHeight).toBe(2000);
    expect(scroller.scrollLeft).toBe(0);
    expect(scroller.scrollTop).toBe(0);
    expect(scroller.clientWidth).toBe(500);
    expect(scroller.clientHeight).toBe(500);
  });

  describe('verticalStart', () => {
    it('should return true when scrollTop is 0', () => {
      const element = createMockElement({ scrollTop: 0 });
      const scroller = new ScrollerElement(element);

      expect(scroller.verticalStart).toBe(true);
    });

    it('should return false when scrollTop is not 0', () => {
      const element = createMockElement({ scrollTop: 100 });
      const scroller = new ScrollerElement(element);

      expect(scroller.verticalStart).toBe(false);
    });
  });

  describe('verticalEnd', () => {
    it('should return true when scrolled to bottom', () => {
      const element = createMockElement({ scrollTop: 1500 });
      const scroller = new ScrollerElement(element, 0);

      expect(scroller.verticalEnd).toBe(true);
    });

    it('should return false when not at bottom', () => {
      const element = createMockElement({ scrollTop: 0 });
      const scroller = new ScrollerElement(element, 0);

      expect(scroller.verticalEnd).toBe(false);
    });
  });

  describe('verticalPercentage', () => {
    it('should calculate vertical scroll percentage', () => {
      const element = createMockElement({ scrollTop: 300 });
      const scroller = new ScrollerElement(element);

      expect(scroller.verticalPercentage).toBe(
        (300 / 2000 - 500) * 100
      );
    });
  });

  describe('horizontalStart', () => {
    it('should return true when scrollLeft is 0', () => {
      const element = createMockElement({ scrollLeft: 0 });
      const scroller = new ScrollerElement(element);

      expect(scroller.horizontalStart).toBe(true);
    });

    it('should return false when scrollLeft is not 0', () => {
      const element = createMockElement({ scrollLeft: 100 });
      const scroller = new ScrollerElement(element);

      expect(scroller.horizontalStart).toBe(false);
    });
  });

  describe('horizontalEnd', () => {
    it('should return true when scrolled to right edge', () => {
      const element = createMockElement({ scrollLeft: 500 });
      const scroller = new ScrollerElement(element, 0);

      expect(scroller.horizontalEnd).toBe(true);
    });

    it('should return false when not at right edge', () => {
      const element = createMockElement({ scrollLeft: 0 });
      const scroller = new ScrollerElement(element, 0);

      expect(scroller.horizontalEnd).toBe(false);
    });
  });

  describe('horizontalPercentage', () => {
    it('should calculate horizontal scroll percentage', () => {
      const element = createMockElement({ scrollLeft: 200 });
      const scroller = new ScrollerElement(element);

      expect(scroller.horizontalPercentage).toBe(
        (200 / 1000 - 500) * 100
      );
    });
  });
});
