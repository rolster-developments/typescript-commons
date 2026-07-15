import { downloadBlob } from './file-helper';

describe('downloadBlob', () => {
  it('should create a link element and trigger download', () => {
    const createElement = document.createElement.bind(document);
    const createObjectURL = vi.fn(() => 'blob:mock-url');
    const revokeObjectURL = vi.fn();

    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;

    const anchorClick = vi.fn();

    const mockAnchor = document.createElement('a');
    mockAnchor.click = anchorClick;

    const spy = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(mockAnchor);

    const blob = new Blob(['test'], { type: 'text/plain' });

    downloadBlob(blob, 'test.txt');

    expect(spy).toHaveBeenCalledWith('a');
    expect(mockAnchor.download).toBe('test.txt');
    expect(mockAnchor.href).toBe('blob:mock-url');
    expect(anchorClick).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');

    spy.mockRestore();
  });
});
