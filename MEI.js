var fileInput = document.getElementById('fileInput');
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

fileInput.onchange = function(e) {
  var file = e.target.files[0];
  var reader = new FileReader();

  reader.onload = function(e) {
    var img = new Image();

    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
};

function floodFill(ctx, x, y, targetColor, replacementColor) {
  // Get the color of the pixel at (x, y)
  var imageData = ctx.getImageData(x, y, 1, 1);
  var pixelColor = imageData.data;

  // If the pixel's color is not the target color, return
  if (!colorsMatch(pixelColor, targetColor)) {
    return;
  }

  // Set the color of the pixel to the replacement color
  imageData.data[0] = replacementColor[0];
  imageData.data[1] = replacementColor[1];
  imageData.data[2] = replacementColor[2];
  imageData.data[3] = replacementColor[3];
  ctx.putImageData(imageData, x, y);

  // Recursively call floodFill on the neighboring pixels
  floodFill(ctx, x + 1, y, targetColor, replacementColor);
  floodFill(ctx, x - 1, y, targetColor, replacementColor);
  floodFill(ctx, x, y + 1, targetColor, replacementColor);
  floodFill(ctx, x, y - 1, targetColor, replacementColor);
}

function colorsMatch(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

canvas.onclick = function(e) {
  var x = e.offsetX;
  var y = e.offsetY;
  var imageData = ctx.getImageData(x, y, 1, 1);
  var clickedColor = imageData.data;

  var transparentColor = [0, 0, 0, 0];
  floodFill(ctx, x, y, clickedColor, transparentColor);
};
