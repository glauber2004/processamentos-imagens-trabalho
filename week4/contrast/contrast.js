window.onload = function() {
    let originalCanvas = document.getElementById('originalCanvas');
    let originalContext = originalCanvas.getContext('2d');
    let imageLoader = document.getElementById('imageLoader');
    let contrastValue = document.getElementById('contrastValue');
    let increaseContrast = document.getElementById('increaseContrast');
    let decreaseContrast = document.getElementById('decreaseContrast');

    let originalImageData = null;

    imageLoader.addEventListener('change', treatImage, false);
    increaseContrast.addEventListener('click', () => adjustContrastIncrease(parseFloat(contrastValue.value)), false);
    decreaseContrast.addEventListener('click', () => adjustContrastDecrease(parseFloat(contrastValue.value)), false);

    function treatImage(changeEvent) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                originalCanvas.width = img.width;
                originalCanvas.height = img.height;
                originalContext.drawImage(img, 0, 0);

                //imagem original
                originalImageData = originalContext.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(changeEvent.target.files[0]);
    }

    function adjustContrastIncrease(value) {
        if (!originalImageData || value <= 0) return;

        //cópia
        let imageData = new ImageData(new Uint8ClampedArray(originalImageData.data), originalImageData.width, originalImageData.height);
        let data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = clamp(data[i] * value);
            data[i + 1] = clamp(data[i + 1] * value);
            data[i + 2] = clamp(data[i + 2] * value);
            data[i + 3] = 255;
            //em ordem RGBA - A=alpha
        }

        originalContext.putImageData(imageData, 0, 0);
    }

    function adjustContrastDecrease(value) {
        if (!originalImageData || value <= 0) return;

        //cópia
        let imageData = new ImageData(new Uint8ClampedArray(originalImageData.data), originalImageData.width, originalImageData.height);
        let data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = clamp(data[i] / value);
            data[i + 1] = clamp(data[i + 1] / value);
            data[i + 2] = clamp(data[i + 2] / value);
            data[i + 3] = 255;
            //em ordem RGBA - A=alpha
        }

        originalContext.putImageData(imageData, 0, 0);
    }

    function clamp(value) {
        return Math.max(0, Math.min(255, value));
    }
}