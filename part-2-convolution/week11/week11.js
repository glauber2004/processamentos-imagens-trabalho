window.onload = function() {
    let originalCanvas = document.getElementById('originalCanvas');
    let ctxOriginal = originalCanvas.getContext('2d');
    let imageLoader = document.getElementById('imageLoader');

    let canvasMin = document.getElementById('canvasMin');
    let ctxMin = canvasMin.getContext('2d');
    
    let canvasMax = document.getElementById('canvasMax');
    let ctxMax = canvasMax.getContext('2d');
    
    let canvasMean = document.getElementById('canvasMean');
    let ctxMean = canvasMean.getContext('2d');

    imageLoader.addEventListener('change', treatImage, false);

    function treatImage(changeEvent) {
        let reader = new FileReader(); // Objeto para conseguir base64
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                // Ajusta o tamanho dos canvases para o tamanho da imagem
                [originalCanvas, canvasMin, canvasMax, canvasMean].forEach(canvas => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                });

                // Desenha a imagem original no primeiro canvas
                ctxOriginal.drawImage(img, 0, 0);

                // Aplica os filtros de mínimo, máximo e média
                applyFilters(ctxOriginal.getImageData(0, 0, img.width, img.height), img.width, img.height);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(changeEvent.target.files[0]);
    }

    function applyFilters(imageData, width, height) {
        let pixels = imageData.data;
        
        let imageDataMin = ctxMin.createImageData(width, height);
        let imageDataMax = ctxMax.createImageData(width, height);
        let imageDataMean = ctxMean.createImageData(width, height);

        for (let i = 1; i < height - 1; i++) {
            for (let j = 1; j < width - 1; j++) {
                let index = (i * width + j) * 4; // Índice do pixel

                // Coleta a máscara de 3x3 em torno do pixel atual
                let mask = getMask(pixels, i, j, width);

                // Calcula o valor mínimo, máximo e médio
                let minVal = Math.min(...mask);
                let maxVal = Math.max(...mask);
                let meanVal = mask.reduce((a, b) => a + b, 0) / mask.length;

                // Atualiza os pixels da nova imagem
                imageDataMin.data[index] = imageDataMin.data[index + 1] = imageDataMin.data[index + 2] = minVal;
                imageDataMax.data[index] = imageDataMax.data[index + 1] = imageDataMax.data[index + 2] = maxVal;
                imageDataMean.data[index] = imageDataMean.data[index + 1] = imageDataMean.data[index + 2] = meanVal;

                // Definir alpha como 255 (opaco)
                imageDataMin.data[index + 3] = imageDataMax.data[index + 3] = imageDataMean.data[index + 3] = 255;
            }
        }

        // Desenha as imagens resultantes nos canvases
        ctxMin.putImageData(imageDataMin, 0, 0);
        ctxMax.putImageData(imageDataMax, 0, 0);
        ctxMean.putImageData(imageDataMean, 0, 0);
    }

    function getMask(pixels, row, col, width) {
        let mask = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let index = ((row + i) * width + (col + j)) * 4;
                // Pegue apenas um canal de cor (grayscale)
                mask.push(pixels[index]);
            }
        }
        return mask;
    }
}
