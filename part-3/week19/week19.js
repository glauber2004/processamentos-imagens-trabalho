window.onload = function() {
    let originalCanvas = document.getElementById('originalCanvas');
    let originalContext = originalCanvas.getContext('2d');
    let dilatedCanvas = document.getElementById('dilatedCanvas');
    let dilatedContext = dilatedCanvas.getContext('2d');
    let imageLoader = document.getElementById('imageLoader');
    let dilateButton = document.getElementById('dilateButton');

    imageLoader.addEventListener('change', treatImage, false);
    dilateButton.addEventListener('click', dilateImage);

    // Função para ler a imagem fornecida
    function treatImage(changeEvent) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                // Ajusta o tamanho dos canvas para o tamanho da imagem
                originalCanvas.width = img.width;
                originalCanvas.height = img.height;
                dilatedCanvas.width = img.width;
                dilatedCanvas.height = img.height;

                // Desenha a imagem original no primeiro canvas
                originalContext.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(changeEvent.target.files[0]);
    }

    // Função para realizar a dilatação
    function dilateImage() {
        let imageData = originalContext.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        let data = imageData.data;
        let dilatedData = new Uint8ClampedArray(data);

        // Define o elemento estruturante 3x3
        let structureElement = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 0], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (let y = 1; y < originalCanvas.height - 1; y++) {
            for (let x = 1; x < originalCanvas.width - 1; x++) {
                let maxIntensity = 0;

                // Percorre o elemento estruturante
                for (let i = 0; i < structureElement.length; i++) {
                    let dx = structureElement[i][0];
                    let dy = structureElement[i][1];
                    let nx = x + dx;
                    let ny = y + dy;
                    let offset = (ny * originalCanvas.width + nx) * 4;

                    // Calcula a intensidade máxima para dilatação
                    maxIntensity = Math.max(maxIntensity, data[offset]);
                }

                // Define o pixel dilatado
                let index = (y * originalCanvas.width + x) * 4;
                dilatedData[index] = maxIntensity;      // Red
                dilatedData[index + 1] = maxIntensity;  // Green
                dilatedData[index + 2] = maxIntensity;  // Blue
                dilatedData[index + 3] = 255;           // Alpha
            }
        }

        // Aplica a imagem dilatada no canvas de saída
        dilatedContext.putImageData(new ImageData(dilatedData, originalCanvas.width, originalCanvas.height), 0, 0);
    }
}


//função para baixar a nova imagem 
function downloadImage() {
    const dilatedCanvas = document.getElementById('dilatedCanvas');
    const downloadLink = document.createElement('a');

    //converter canvas para URL
    downloadLink.href = dilatedCanvas.toDataURL('image/jpg');
    downloadLink.download = 'image_dilate.jpg';
    downloadLink.click();
}

//botão de download 
document.getElementById('downloadButton').addEventListener('click', downloadImage);