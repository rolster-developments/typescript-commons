export function downloadBlob(blob: Blob, name: string): void {
  const fileUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = fileUrl;
  link.download = name;
  link.click();

  URL.revokeObjectURL(fileUrl);
}
