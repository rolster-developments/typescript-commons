import { Double, double } from './double';

describe.skip('Double Class', () => {
  describe('Creation and Basic Properties', () => {
    test('should create from number', () => {
      const number = double(123.45);
      expect(number.data).toBe(123.45);
      expect(number.isPositive()).toBe(true);
    });

    test('should create from string', () => {
      const number = double('678.90');
      expect(number.data).toBe(678.9);
    });

    test('should create zero', () => {
      const zero = Double.zero();
      expect(zero.data).toBe(0);
      expect(zero.isZero()).toBe(true);
    });

    test('should handle negative numbers', () => {
      const d = double(-123.45);
      expect(d.isNegative()).toBe(true);
      expect(d.data).toBe(-123.45);
    });
  });

  describe('Arithmetic Operations', () => {
    describe('Plus Operation', () => {
      test('should add two positive numbers', () => {
        const d1 = double(10.5);
        const d2 = double(20.3);
        const result = d1.plus(d2);
        expect(result.data).toBe(30.8);
      });

      test('should add positive and negative numbers', () => {
        const d1 = double(15.7);
        const d2 = double(-5.2);
        const result = d1.plus(d2);
        expect(result.data).toBe(10.5);
      });
    });

    describe('Minus Operation', () => {
      test('should subtract two positive numbers', () => {
        const d1 = double(25.8);
        const d2 = double(10.3);
        const result = d1.minus(d2);
        expect(result.data).toBe(15.5);
      });

      test('should subtract negative numbers', () => {
        const d1 = double(10);
        const d2 = double(-5);
        const result = d1.minus(d2);
        expect(result.data).toBe(15);
      });
    });

    describe('Multiply Operation', () => {
      test('should multiply two positive numbers', () => {
        const d1 = double(3.5);
        const d2 = double(4.2);
        const result = d1.multiply(d2);
        expect(result.data).toBe(14.7);
      });

      test('should multiply by zero', () => {
        const d1 = double(123.45);
        const zero = Double.zero();
        const result = d1.multiply(zero);
        expect(result.isZero()).toBe(true);
      });
    });

    describe('Divide Operation', () => {
      test('should divide two positive numbers', () => {
        const d1 = double(15);
        const d2 = double(3);
        const result = d1.divide(d2);
        expect(result.data).toBe(5);
      });

      test('should handle decimal division', () => {
        const d1 = double(10);
        const d2 = double(4);
        const result = d1.divide(d2);
        expect(result.data).toBe(2.5);
      });

      test('should throw error when dividing by zero', () => {
        const d1 = double(10);
        const zero = Double.zero();
        expect(() => d1.divide(zero)).toThrow(
          '[DecimalError] Division by zero'
        );
      });
    });

    describe('Module Operation', () => {
      test('should calculate modulo correctly', () => {
        const d1 = double(17);
        const d2 = double(5);
        const result = d1.module(d2);
        expect(result.data).toBe(2);
      });

      test('should handle decimal modulo', () => {
        const d1 = double(10.5);
        const d2 = double(3.2);
        const result = d1.module(d2);
        expect(result.data).toBe(9);
      });
    });

    describe('Percentage Operation', () => {
      test('should calculate percentage correctly', () => {
        const d1 = double(200);
        const result = d1.percentage(15);
        expect(result.data).toBe(30);
      });

      test('should handle decimal percentage', () => {
        const d1 = double(150);
        const result = d1.percentage(12.5);
        expect(result.data).toBe(18.75);
      });
    });
  });

  describe('Rounding Operations', () => {
    test('should round to specified precision', () => {
      const d = double(123.456789);
      const rounded = d.round(2);
      expect(rounded.data).toBe(123.46);
    });

    test('should round ceil correctly', () => {
      const d = double(123.451);
      const rounded = d.roundCeil(1);
      expect(rounded.data).toBe(123.5);
    });

    test('should round floor correctly', () => {
      const d = double(123.459);
      const rounded = d.roundFloor(1);
      expect(rounded.data).toBe(123.4);
    });
  });

  describe('Utility Methods', () => {
    test('should return absolute value', () => {
      const d = double(-123.45);
      const abs = d.abs();
      expect(abs.data).toBe(123.45);
      expect(abs.isPositive()).toBe(true);
    });

    test('should return negative value', () => {
      const d = double(123.45);
      const neg = d.negative();
      expect(neg.data).toBe(-123.45);
      expect(neg.isNegative()).toBe(true);
    });

    test('should clone correctly', () => {
      const d1 = double(123.45);
      const d2 = d1.clone();
      expect(d1.equals(d2)).toBe(true);
      expect(d1).not.toBe(d2);
    });

    test('should format to string with fixed decimals', () => {
      const d = double(123.456789);
      const formatted = d.format(2);
      expect(formatted).toBe('123.46');
    });

    test('should convert to string', () => {
      const d = double(123.45);
      expect(d.toString()).toContain('123.45');
    });
  });

  describe('Edge Cases', () => {
    test('should handle very large numbers', () => {
      const d = double(123456789012345);
      expect(d.greaterThan(double(100000000000000))).toBe(true);
    });

    test('should handle zero operations', () => {
      const zero = Double.zero();
      const d = double(123.45);

      expect(zero.plus(d).equals(d)).toBe(true);
      expect(d.plus(zero).equals(d)).toBe(true);
      expect(d.minus(zero).equals(d)).toBe(true);
      expect(zero.multiply(d).isZero()).toBe(true);
    });

    test('should handle chained operations', () => {
      const result = double(10).plus(5).multiply(2).minus(5).divide(3);

      expect(result.data).toBe(8.33);
    });
  });

  // ==================== PRECISION TESTS ====================
  describe('Precision Tests', () => {
    test('should maintain precision in decimal operations', () => {
      // Native JS has precision issues with this operation
      // const jsResult = 0.1 + 0.2; // Should be 0.3, but gives 0.30000000000000004

      const d1 = double(0.1);
      const d2 = double(0.2);
      const doubleResult = d1.plus(d2);

      expect(doubleResult.data).toBe(0.3);
      expect(doubleResult.equals(0.3)).toBe(true);
    });

    test('should handle precise multiplication', () => {
      const d1 = double(1.23456789);
      const d2 = double(9.87654321);
      const result = d1.multiply(d2);

      // This multiplication would have precision issues in native JS
      expect(result.data).toBe(12.193263111263526);
    });
  });
});
