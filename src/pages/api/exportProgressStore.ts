let progress = 0;

export function setExportProgress(value: number) {
  progress = Math.max(0, Math.min(100, value));
}

export function getExportProgress() {
  return progress;
}

export function resetExportProgress() {
  progress = 0;
}
