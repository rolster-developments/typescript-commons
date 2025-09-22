const sliceSize = 512;

export function base64ToBlob(data64: string, mimeType: string): Blob {
  const result64 = data64.replace(/^[^,]+,/, '').replace(/\s/g, '');

  const byteCharacters = window.atob(result64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
}
