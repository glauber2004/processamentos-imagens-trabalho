window.onload = function () {
    let originalCanvas = document.getElementById('originalCanvas');
    let ctxOriginal = originalCanvas.getContext('2d');
    let canvasResult = document.getElementById('canvasResult');
    let ctxResult = canvasResult.getContext('2d');
    let imageLoader = document.getElementById('imageLoader');
    let currentImageData;

    imageLoader.addEventListener('change', treatImage, false);
    document.getElementById('conservativeFilterBtn').addEventListener('click', applyConservativeFilter);

    function treatImage(changeEvent) {
        let reader = new FileReader();
        reader.onload = function (event) {
            let img = new Image();
            img.onload = function () {
                [originalCanvas, canvasResult].forEach(canvas => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                });

                ctxOriginal.drawImage(img, 0, 0);
                currentImageData = ctxOriginal.getImageData(0, 0, img.width, img.height);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(changeEvent.target.files[0]);
    }

    function applyConservativeFilter() {
        if (!currentImageData) return;
        let width = currentImageData.width;
        let height = currentImageData.height;
        let newImageData = ctxResult.createImageData(width, height);

        for (let i = 1; i < height - 1; i++) {
            for (let j = 1; j < width - 1; j++) {
                let index = (i * width + j) * 4;
                let neighbors = getHeadquarters(currentImageData.data, i, j, width);

                // Aplicar suavização conservativa
                newImageData.data[index] = newImageData.data[index + 1] = newImageData.data[index + 2] = applyConservativeSmoothing(neighbors, currentImageData.data[index]);
                newImageData.data[index + 3] = 255;
            }
        }

        ctxResult.putImageData(newImageData, 0, 0);
    }

    function getHeadquarters(pixels, row, col, width) {
        let headquarters = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let index = ((row + i) * width + (col + j)) * 4;
                headquarters.push(pixels[index]);
            }
        }
        headquarters.splice(4, 1); // Remover o valor central
        return headquarters;
    }

    function applyConservativeSmoothing(neighbors, centerValue) {
        let minValue = Math.min(...neighbors);
        let maxValue = Math.max(...neighbors);

        if (centerValue < minValue) {
            return minValue;
        } else if (centerValue > maxValue) {
            return maxValue;
        } else {
            return centerValue;
        }
    }
}


//função para baixar a nova imagem 
function downloadImage() {
    const canvasResult = document.getElementById('canvasResult');
    const downloadLink = document.createElement('a');
    downloadLink.href = canvasResult.toDataURL('image/jpg');
    downloadLink.download = 'image_conservative.jpg';
    downloadLink.click();
}
document.getElementById('downloadButton').addEventListener('click', downloadImage);