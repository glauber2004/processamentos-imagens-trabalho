window.onload = function() {
    let originalCanvas = document.getElementById('originalCanvas');
    let ctxOriginal = originalCanvas.getContext('2d');
    let imageLoader = document.getElementById('imageLoader');
    
    let canvasMean = document.getElementById('canvasMean');
    let ctxMean = canvasMean.getContext('2d');

    imageLoader.addEventListener('change', treatImage, false);

    function treatImage(changeEvent) {
        let reader = new FileReader(); // Objeto para conseguir base64
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                // Ajusta o tamanho dos canvases para o tamanho da imagem
                [originalCanvas, canvasMean].forEach(canvas => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                });

                // Desenha a imagem original no primeiro canvas
                ctxOriginal.drawImage(img, 0, 0);

                // Aplica os filtros dee mediana
                applyFilters(ctxOriginal.getImageData(0, 0, img.width, img.height), img.width, img.height);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(changeEvent.target.files[0]);
    }

    function applyFilters(imageData, width, height) {
        let pixels = imageData.data;
        let imageDataMean = ctxMean.createImageData(width, height);

        for (let i = 1; i < height - 1; i++) {
            for (let j = 1; j < width - 1; j++) {
                let index = (i * width + j) * 4;

                // Matriz 3x3 em torno do pixel atual
                let headquarters = getHeadquarters(pixels, i, j, width);

                // Calcula a mediana
                let medianVal = getMedian(headquarters);

                // Atualiza os pixels da nova imagem
                imageDataMean.data[index] = imageDataMean.data[index + 1] = imageDataMean.data[index + 2] = medianVal;

                // Definir alpha como 255 (opaco)
                imageDataMean.data[index + 3] = 255;
            }
        }

        // Desenha a imagem resultante no canvas
        ctxMean.putImageData(imageDataMean, 0, 0);
    }

    function getHeadquarters(pixels, row, col, width) {
        let headquarters = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let index = ((row + i) * width + (col + j)) * 4;
                headquarters.push(pixels[index]); // Apenas o valor do canal vermelho
            }
        }
        return headquarters;
    }

    // Função para calcular a mediana
    function getMedian(headquarters) {
        // Ordena os valores do menor para o maior
        let order = headquarters.slice().sort((a, b) => a - b);
        return order[4];
    }
}


//função para baixar a nova imagem 
function downloadImage() {
    const grayCanvas = document.getElementById('grayCanvas');
    const downloadLink = document.createElement('a');

    //converter canvas para URL
    downloadLink.href = grayCanvas.toDataURL('image/jpg');
    downloadLink.download = 'image_thresholding.jpg';
    downloadLink.click();
}

//botão de download 
document.getElementById('downloadButton').addEventListener('click', downloadImage);
