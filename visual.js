function XYrgbToBox(x, y, color) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshToonMaterial({ color: color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = x;
  cube.position.y = y;
  grid.add(cube);
}

function PNGFileIntoVisibleBoxes(filename) {
  fetch(filename)
    .then((response) => response.blob())
    .then((blob) => blob.arrayBuffer())
    .then((arrayBuffer) => {
      pngdata = UPNG.decode(arrayBuffer);
      PNGDataIntoVisibleBoxes(pngdata);
    });
}

function PNGDataIntoVisibleBoxes(pngdata) {
  rgbaframes = UPNG.toRGBA8(pngdata);
  rgbaframes.forEach((frame) => {
    const array = new DataView(frame);
    for (let y = 0; y < pngdata.height; y++) {
      for (let x = 0; x < pngdata.width; x++) {
        let index = (image.width * y + x) * 4;
        let pixel = array.getUint32(index, false);
        let visible = pixel << 24 === 255 << 24;
        if (visible) XYrgbToBox(x, y, pixel >> 8);
      }
    }
  });
}
