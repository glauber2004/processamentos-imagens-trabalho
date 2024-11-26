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

                // Calcula a mediana com base na ordem
                let medianVal = getMedian(headquarters);

                // Atualiza os pixels da nova imagem
                imageDataMean.data[index] = imageDataMean.data[index + 1] = imageDataMean.data[index + 2] = medianVal;
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

    // Função para calcular a mediana de acordo com a ordem escolhida
    function getMedian(headquarters) {
        let order = headquarters.slice().sort((a, b) => a - b);
        const ord = parseInt(document.getElementById('ord').value) - 1; // Ajuste para o índice baseado em zero
        return order[ord];
    }

    // Função para aplicar o filtro de mediana com a ordem escolhida
    function applyOrder() {
        const ord = parseInt(document.getElementById('ord').value);

        // Verifica se a ordem está dentro do intervalo
        if (ord < 1 || ord > 8) {
            alert('Por favor, insira uma ordem entre 1 e 8.');
            return;
        }

        // Obtém o contexto da imagem original e aplica o filtro com a nova ordem
        const imageData = ctxOriginal.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        applyFilters(imageData, originalCanvas.width, originalCanvas.height);
    }

    // Adiciona o evento ao botão "Aplicar Ordem"
    document.querySelector('.convert-button').addEventListener('click', applyOrder);
}

// Função para baixar a nova imagem 
function downloadImage() {
    const canvasMean = document.getElementById('canvasMean');
    const downloadLink = document.createElement('a');
    downloadLink.href = canvasMean.toDataURL('image/jpg');
    downloadLink.download = 'image_mean.jpg';
    downloadLink.click();
}
document.getElementById('downloadButton').addEventListener('click', downloadImage);
