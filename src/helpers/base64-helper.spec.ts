import { base64ToBlob } from './base64-helper';

describe('base64ToBlob', () => {
  it('should convert a base64 string to a Blob', () => {
    const data64 = 'data:image/png;base64,iVBORw0KGgo=';
    const blob = base64ToBlob(data64, 'image/png');

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('image/png');
  });

  it('should handle base64 without data URI prefix', () => {
    const data64 = 'aGVsbG8=';
    const blob = base64ToBlob(data64, 'text/plain');

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('text/plain');
  });

  it('should handle empty base64 string', () => {
    const data64 = '';
    const blob = base64ToBlob(data64, 'application/octet-stream');

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBe(0);
  });
});
