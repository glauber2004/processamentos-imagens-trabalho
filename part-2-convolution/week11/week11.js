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
                let index = (i * width + j) * 4; 

                // matriz 3x3 em torno do pixel atual
                let headquarters = getheadquarters(pixels, i, j, width);

                // Calcula o valor mínimo, máximo e médio
                let minVal = getMin(headquarters);
                let maxVal = getMax(headquarters);
                let meanVal = getMean(headquarters);

                // Atualiza os pixels da nova imagem
                imageDataMin.data[index] = imageDataMin.data[index + 1] = imageDataMin.data[index + 2] = minVal;
                imageDataMax.data[index] = imageDataMax.data[index + 1] = imageDataMax.data[index + 2] = maxVal;
                imageDataMean.data[index] = imageDataMean.data[index + 1] = imageDataMean.data[index + 2] = meanVal;

                // Definir alpha como 255 (opaco)
                imageDataMin.data[index + 3] = imageDataMax.data[index + 3] = imageDataMean.data[index + 3] = 255;
            }
        }

        // Desenha as imagens resultantes nos canvas
        ctxMin.putImageData(imageDataMin, 0, 0);
        ctxMax.putImageData(imageDataMax, 0, 0);
        ctxMean.putImageData(imageDataMean, 0, 0);
    }

    function getheadquarters(pixels, row, col, width) {
        let headquarters = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let index = ((row + i) * width + (col + j)) * 4;
                headquarters.push(pixels[index]);
            }
        }
        return headquarters;
    }

    // Função para calcular o mínimo
    function getMin(headquarters) {
        let minVal = Infinity;
        for (let value of headquarters) {
            if (value < minVal) {
                minVal = value;
            }
        }
        return minVal;
    }

    // Função para calcular o máximo
    function getMax(headquarters) {
        let maxVal = -Infinity;
        for (let value of headquarters) {
            if (value > maxVal) {
                maxVal = value;
            }
        }
        return maxVal;
    }

    // Função para calcular a média
    function getMean(headquarters) {
        let sum = 0;
        for (let value of headquarters) {
            sum += value;
        }
        return sum / headquarters.length;
    }
}

//função para baixar a nova imagem 
function downloadImage() {
    const canvasMin = document.getElementById('canvasMin');
    const canvasMax = document.getElementById('canvasMax');
    const canvasMean = document.getElementById('canvasMean');
    const downloadLinkOne = document.createElement('a');
    const downloadLinkTwo = document.createElement('a');
    const downloadLinkThree = document.createElement('a');

    //converter canvas para URL
    downloadLinkOne.href = canvasMin.toDataURL('image/jpg');
    downloadLinkTwo.href = canvasMax.toDataURL('image/jpg');
    downloadLinkThree.href = canvasMean.toDataURL('image/jpg');
    downloadLinkOne.download = 'image_min.jpg';
    downloadLinkTwo.download = 'image_max.jpg';
    downloadLinkThree.download = 'image_mean.jpg';
    downloadLinkOne.click();
    downloadLinkTwo.click();
    downloadLinkThree.click();
}

//botão de download 
document.getElementById('downloadButton').addEventListener('click', downloadImage);
