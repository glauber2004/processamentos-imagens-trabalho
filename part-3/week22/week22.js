window.onload = function() {
    let originalCanvas = document.getElementById('originalCanvas');
    let originalContext = originalCanvas.getContext('2d');
    let closedCanvas = document.getElementById('closedCanvas');
    let closedContext = closedCanvas.getContext('2d');
    let imageLoader = document.getElementById('imageLoader');
    let closeButton = document.getElementById('closeButton');

    imageLoader.addEventListener('change', treatImage, false);
    closeButton.addEventListener('click', closeImage);

    // Função para carregar a imagem
    function treatImage(changeEvent) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                // Ajusta o tamanho dos canvas para o tamanho da imagem
                originalCanvas.width = img.width;
                originalCanvas.height = img.height;
                closedCanvas.width = img.width;
                closedCanvas.height = img.height;

                // Desenha a imagem original no primeiro canvas
                originalContext.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(changeEvent.target.files[0]);
    }

    // Função para realizar a operação de fechamento
    function closeImage() {
        let imageData = originalContext.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        let dilatedData = dilate(imageData);
        let closedData = erode(dilatedData);

        // Aplica a imagem com fechamento no canvas de saída
        closedContext.putImageData(closedData, 0, 0);
    }

    // Função de dilatação (A + B)
    function dilate(imageData) {
        let data = imageData.data;
        let dilatedData = new Uint8ClampedArray(data);

        // Define o elemento estruturante 3x3
        let structureElement = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 0], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (let y = 1; y < imageData.height - 1; y++) {
            for (let x = 1; x < imageData.width - 1; x++) {
                let maxIntensity = 0;

                // Percorre o elemento estruturante
                for (let i = 0; i < structureElement.length; i++) {
                    let dx = structureElement[i][0];
                    let dy = structureElement[i][1];
                    let nx = x + dx;
                    let ny = y + dy;
                    let offset = (ny * imageData.width + nx) * 4;

                    // Calcula a intensidade máxima para dilatação
                    maxIntensity = Math.max(maxIntensity, data[offset]);
                }

                // Define o pixel dilatado
                let index = (y * imageData.width + x) * 4;
                dilatedData[index] = maxIntensity;      // Red
                dilatedData[index + 1] = maxIntensity;  // Green
                dilatedData[index + 2] = maxIntensity;  // Blue
                dilatedData[index + 3] = 255;           // Alpha
            }
        }

        return new ImageData(dilatedData, imageData.width, imageData.height);
    }

    // Função de erosão (resultado da dilatação - B)
    function erode(imageData) {
        let data = imageData.data;
        let erodedData = new Uint8ClampedArray(data);

        // Define o elemento estruturante 3x3
        let structureElement = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 0], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (let y = 1; y < imageData.height - 1; y++) {
            for (let x = 1; x < imageData.width - 1; x++) {
                let minIntensity = 255;

                // Percorre o elemento estruturante
                for (let i = 0; i < structureElement.length; i++) {
                    let dx = structureElement[i][0];
                    let dy = structureElement[i][1];
                    let nx = x + dx;
                    let ny = y + dy;
                    let offset = (ny * imageData.width + nx) * 4;

                    // Calcula a intensidade mínima para erosão
                    minIntensity = Math.min(minIntensity, data[offset]);
                }

                // Define o pixel erodido
                let index = (y * imageData.width + x) * 4;
                erodedData[index] = minIntensity;      // Red
                erodedData[index + 1] = minIntensity;  // Green
                erodedData[index + 2] = minIntensity;  // Blue
                erodedData[index + 3] = 255;           // Alpha
            }
        }

        return new ImageData(erodedData, imageData.width, imageData.height);
    }
}


//função para baixar a nova imagem 
function downloadImage() {
    const closedCanvas = document.getElementById('closedCanvas');
    const downloadLink = document.createElement('a');

    //converter canvas para URL
    downloadLink.href = closedCanvas.toDataURL('image/jpg');
    downloadLink.download = 'image_closed.jpg';
    downloadLink.click();
}

//botão de download 
document.getElementById('downloadButton').addEventListener('click', downloadImage);