function resetZoom() {
  const ratio = window.devicePixelRatio || 1;
  document.body.style.zoom = (1 / ratio) * 100 + '%';
}

window.onload = resetZoom;
window.onresize = resetZoom;
