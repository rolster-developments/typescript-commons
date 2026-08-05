import { SelectionSet } from './selection-set';

interface Article {
  uuid: string;
  name: string;
}

const ARTICLE_A: Article = { uuid: 'a', name: 'Bread' };
const ARTICLE_B: Article = { uuid: 'b', name: 'Milk' };
const ARTICLE_C: Article = { uuid: 'c', name: 'Coffee' };

function articles(values: Article[] = []): SelectionSet<Article> {
  return new SelectionSet(values, (value, element) => {
    return value.uuid === element.uuid;
  });
}

describe('SelectionSet', () => {
  describe('constructor', () => {
    it('should create an empty selection without arguments', () => {
      const selection = new SelectionSet<string>();

      expect(selection.values).toEqual([]);
      expect(selection.size).toBe(0);
      expect(selection.isEmpty).toBe(true);
    });

    it('should create a selection from initial values', () => {
      const selection = new SelectionSet(['a', 'b']);

      expect(selection.values).toEqual(['a', 'b']);
      expect(selection.size).toBe(2);
      expect(selection.isEmpty).toBe(false);
    });
  });

  describe('contains', () => {
    it('should compare primitives by value with the default comparator', () => {
      const selection = new SelectionSet([1, 2]);

      expect(selection.contains(1)).toBe(true);
      expect(selection.contains(3)).toBe(false);
    });

    it('should compare objects by reference with the default comparator', () => {
      const selection = new SelectionSet([ARTICLE_A]);

      expect(selection.contains(ARTICLE_A)).toBe(true);
      expect(selection.contains({ ...ARTICLE_A })).toBe(false);
    });

    it('should compare objects with the given comparator', () => {
      const selection = articles([ARTICLE_A]);

      expect(selection.contains({ uuid: 'a', name: 'Changed' })).toBe(true);
      expect(selection.contains(ARTICLE_B)).toBe(false);
    });
  });

  describe('containsAll', () => {
    it('should return true when every value is selected', () => {
      const selection = articles([ARTICLE_A, ARTICLE_B]);

      expect(selection.containsAll([ARTICLE_A, ARTICLE_B])).toBe(true);
      expect(selection.containsAll([ARTICLE_A])).toBe(true);
    });

    it('should return false when any value is missing', () => {
      const selection = articles([ARTICLE_A]);

      expect(selection.containsAll([ARTICLE_A, ARTICLE_B])).toBe(false);
    });

    it('should return false for an empty collection', () => {
      expect(articles([ARTICLE_A]).containsAll([])).toBe(false);
      expect(articles().containsAll([])).toBe(false);
    });
  });

  describe('containsAny', () => {
    it('should return true when at least one value is selected', () => {
      const selection = articles([ARTICLE_A]);

      expect(selection.containsAny([ARTICLE_A, ARTICLE_B])).toBe(true);
    });

    it('should return false when no value is selected', () => {
      const selection = articles([ARTICLE_C]);

      expect(selection.containsAny([ARTICLE_A, ARTICLE_B])).toBe(false);
    });

    it('should return false for an empty collection', () => {
      expect(articles([ARTICLE_A]).containsAny([])).toBe(false);
    });
  });

  describe('select', () => {
    it('should append the value preserving the selection order', () => {
      const selection = articles([ARTICLE_A]).select(ARTICLE_B);

      expect(selection.values).toEqual([ARTICLE_A, ARTICLE_B]);
    });

    it('should not mutate the original selection', () => {
      const selection = articles([ARTICLE_A]);

      selection.select(ARTICLE_B);

      expect(selection.values).toEqual([ARTICLE_A]);
    });

    it('should return the same instance when the value is already selected', () => {
      const selection = articles([ARTICLE_A]);

      expect(selection.select(ARTICLE_A)).toBe(selection);
    });

    it('should return the same instance for an equal value', () => {
      const selection = articles([ARTICLE_A]);

      expect(selection.select({ uuid: 'a', name: 'Changed' })).toBe(selection);
    });
  });

  describe('unselect', () => {
    it('should remove the value keeping the remaining ones', () => {
      const selection = articles([ARTICLE_A, ARTICLE_B, ARTICLE_C]);

      expect(selection.unselect(ARTICLE_B).values).toEqual([
        ARTICLE_A,
        ARTICLE_C
      ]);
    });

    it('should remove the value matched by the comparator', () => {
      const selection = articles([ARTICLE_A, ARTICLE_B]);

      const result = selection.unselect({ uuid: 'a', name: 'Changed' });

      expect(result.values).toEqual([ARTICLE_B]);
    });

    it('should not mutate the original selection', () => {
      const selection = articles([ARTICLE_A, ARTICLE_B]);

      selection.unselect(ARTICLE_A);

      expect(selection.values).toEqual([ARTICLE_A, ARTICLE_B]);
    });

    it('should return the same instance when the value is not selected', () => {
      const selection = articles([ARTICLE_A]);

      expect(selection.unselect(ARTICLE_B)).toBe(selection);
    });
  });

  describe('toggle', () => {
    it('should select a value that is not selected', () => {
      const selection = articles().toggle(ARTICLE_A);

      expect(selection.values).toEqual([ARTICLE_A]);
    });

    it('should unselect a value that is selected', () => {
      const selection = articles([ARTICLE_A, ARTICLE_B]).toggle(ARTICLE_A);

      expect(selection.values).toEqual([ARTICLE_B]);
    });

    it('should restore the initial state after toggling twice', () => {
      const selection = articles([ARTICLE_A]);

      const result = selection.toggle(ARTICLE_B).toggle(ARTICLE_B);

      expect(result.values).toEqual([ARTICLE_A]);
    });
  });

  describe('toggleAll', () => {
    it('should select every value when none is selected', () => {
      const selection = articles().toggleAll([ARTICLE_A, ARTICLE_B]);

      expect(selection.values).toEqual([ARTICLE_A, ARTICLE_B]);
    });

    it('should select only the pending values when some are selected', () => {
      const selection = articles([ARTICLE_B]);

      const result = selection.toggleAll([ARTICLE_A, ARTICLE_B, ARTICLE_C]);

      expect(result.values).toEqual([ARTICLE_B, ARTICLE_A, ARTICLE_C]);
    });

    it('should unselect every value when all of them are selected', () => {
      const selection = articles([ARTICLE_A, ARTICLE_B, ARTICLE_C]);

      const result = selection.toggleAll([ARTICLE_A, ARTICLE_B]);

      expect(result.values).toEqual([ARTICLE_C]);
    });

    it('should not mutate the original selection', () => {
      const selection = articles([ARTICLE_A]);

      selection.toggleAll([ARTICLE_A, ARTICLE_B]);

      expect(selection.values).toEqual([ARTICLE_A]);
    });

    it('should return the same instance for an empty collection', () => {
      const selection = articles([ARTICLE_A]);

      expect(selection.toggleAll([])).toBe(selection);
    });
  });

  describe('refresh', () => {
    it('should retain only the selected values still present', () => {
      const selection = articles([ARTICLE_A, ARTICLE_B, ARTICLE_C]);

      const result = selection.refresh([ARTICLE_C, ARTICLE_A]);

      expect(result.values).toEqual([ARTICLE_A, ARTICLE_C]);
    });

    it('should retain the values matched by the comparator', () => {
      const selection = articles([ARTICLE_A]);

      const result = selection.refresh([{ uuid: 'a', name: 'Changed' }]);

      expect(result.values).toEqual([ARTICLE_A]);
    });

    it('should discard every value for an empty collection', () => {
      const selection = articles([ARTICLE_A, ARTICLE_B]);

      const result = selection.refresh([]);

      expect(result.values).toEqual([]);
      expect(result.isEmpty).toBe(true);
    });

    it('should not mutate the original selection', () => {
      const selection = articles([ARTICLE_A, ARTICLE_B]);

      selection.refresh([ARTICLE_A]);

      expect(selection.values).toEqual([ARTICLE_A, ARTICLE_B]);
    });

    it('should return the same instance when nothing is discarded', () => {
      const selection = articles([ARTICLE_A]);

      expect(selection.refresh([ARTICLE_A, ARTICLE_B])).toBe(selection);
    });

    it('should return the same instance when the selection is empty', () => {
      const selection = articles();

      expect(selection.refresh([])).toBe(selection);
    });
  });

  describe('clear', () => {
    it('should discard every selected value', () => {
      const selection = articles([ARTICLE_A, ARTICLE_B]).clear();

      expect(selection.values).toEqual([]);
      expect(selection.isEmpty).toBe(true);
    });

    it('should not mutate the original selection', () => {
      const selection = articles([ARTICLE_A]);

      selection.clear();

      expect(selection.values).toEqual([ARTICLE_A]);
    });

    it('should return the same instance when the selection is empty', () => {
      const selection = articles();

      expect(selection.clear()).toBe(selection);
    });
  });

  describe('comparator', () => {
    it('should preserve the comparator across operations', () => {
      const selection = articles()
        .select(ARTICLE_A)
        .toggleAll([ARTICLE_B])
        .refresh([ARTICLE_A, ARTICLE_B, ARTICLE_C]);

      expect(selection.contains({ uuid: 'b', name: 'Changed' })).toBe(true);
    });

    it('should invoke the comparator with the value and the element', () => {
      const equals = vi.fn((value: Article, element: Article) => {
        return value.uuid === element.uuid;
      });

      new SelectionSet([ARTICLE_A], equals).contains(ARTICLE_B);

      expect(equals).toHaveBeenCalledWith(ARTICLE_B, ARTICLE_A);
    });
  });
});
