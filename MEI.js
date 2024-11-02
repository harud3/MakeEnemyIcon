var fileInput = document.getElementById('fileInput');
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var toleranceInput = document.getElementById('toleranceInput');
var croppedCanvas = document.createElement('canvas');
var cropSizeInput = document.getElementById('cropSizeInput');
var isTransmission = true;
var finishCrop = false;
fileInput.onchange = function(e) {
  var file = e.target.files[0];
  var reader = new FileReader();

  isTransmission = true;
  if(finishCrop){
    finishCrop = false;
    croppedCanvas.parentNode.replaceChild(canvas, croppedCanvas);
  }

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

  fileInput.value = '';
};

function floodFill(ctx, startX, startY, targetColor, replacementColor, tolerance) {
  var stack = [[startX, startY]];
  var width = ctx.canvas.width;
  var height = ctx.canvas.height;
  var imageData = ctx.getImageData(0, 0, width, height);
  var data = imageData.data;

  while (stack.length) {
    var position = stack.pop();
    var x = position[0];
    var y = position[1];

    var index = (y * width + x) * 4;

    if (colorsAreClose([data[index], data[index + 1], data[index + 2], data[index + 3]], targetColor, tolerance)) {
      data[index] = replacementColor[0];
      data[index + 1] = replacementColor[1];
      data[index + 2] = replacementColor[2];
      data[index + 3] = replacementColor[3];

      if (x > 0) stack.push([x - 1, y]);
      if (x < width - 1) stack.push([x + 1, y]);
      if (y > 0) stack.push([x, y - 1]);
      if (y < height - 1) stack.push([x, y + 1]);
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function colorsAreClose(a, b, tolerance) {
  return Math.abs(a[0] - b[0]) <= tolerance && Math.abs(a[1] - b[1]) <= tolerance && Math.abs(a[2] - b[2]) <= tolerance;
}

canvas.onclick = function(e) {
  var x = e.offsetX;
  var y = e.offsetY;


  if(isTransmission){
    isTransmission = false;
    var imageData = ctx.getImageData(x, y, 1, 1);
  var clickedColor = imageData.data;

  var transparentColor = [0, 0, 0, 0];
  var tolerance = parseInt(toleranceInput.value);
  floodFill(ctx, x, y, clickedColor, transparentColor, tolerance);
  }
  else{
    finishCrop = true;
    var cropSize = parseInt(cropSizeInput.value);
    var croppedImageData = ctx.getImageData(x - (cropSize * 0.93), y - (cropSize * 0.1), cropSize, cropSize);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(croppedImageData, 0, 0);

    // Create a new canvas and draw the cropped image on it
    croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropSize;
    croppedCanvas.height = cropSize;
    var croppedCtx = croppedCanvas.getContext('2d');
    croppedCtx.putImageData(croppedImageData, 0, 0);
    croppedCanvas.style.border = '3px solid black';
    // Replace the original canvas with the cropped canvas
    canvas.parentNode.replaceChild(croppedCanvas, canvas);
  }

  
};
