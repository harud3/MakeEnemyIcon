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
