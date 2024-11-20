window.onload = function() {
    let originalCanvas = document.getElementById('originalCanvas');
    let originalContext = originalCanvas.getContext('2d');
    let contourCanvas = document.getElementById('contourCanvas');
    let contourContext = contourCanvas.getContext('2d');
    let imageLoader = document.getElementById('imageLoader');
    let contourButton = document.getElementById('contourButton');

    imageLoader.addEventListener('change', treatImage, false);
    contourButton.addEventListener('click', applyContour);

    // Função para carregar a imagem
    function treatImage(changeEvent) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                // Ajusta o tamanho dos canvas para o tamanho da imagem
                originalCanvas.width = img.width;
                originalCanvas.height = img.height;
                contourCanvas.width = img.width;
                contourCanvas.height = img.height;

                // Desenha a imagem original no primeiro canvas
                originalContext.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(changeEvent.target.files[0]);
    }

    // Função para realizar a operação de contorno
    function applyContour() {
        let imageData = originalContext.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        let erodedData = erode(imageData);
        let contourData = new ImageData(imageData.width, imageData.height);

        // Calcula a diferença entre a imagem original e a versão erodida
        for (let i = 0; i < imageData.data.length; i += 4) {
            contourData.data[i] = Math.max(imageData.data[i] - erodedData.data[i], 0);         // Red
            contourData.data[i + 1] = Math.max(imageData.data[i + 1] - erodedData.data[i + 1], 0); // Green
            contourData.data[i + 2] = Math.max(imageData.data[i + 2] - erodedData.data[i + 2], 0); // Blue
            contourData.data[i + 3] = 255; // Alpha
        }

        // Aplica a imagem com contorno no canvas de saída
        contourContext.putImageData(contourData, 0, 0);
    }

    // Função de erosão
    function erode(imageData) {
        let data = imageData.data;
        let width = imageData.width;
        let height = imageData.height;
        let erodedData = new Uint8ClampedArray(data);

        // Define o elemento estruturante 3x3
        let structureElement = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 0], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let minIntensity = 255;

                // Percorre o elemento estruturante
                for (let i = 0; i < structureElement.length; i++) {
                    let dx = structureElement[i][0];
                    let dy = structureElement[i][1];
                    let nx = x + dx;
                    let ny = y + dy;
                    let offset = (ny * width + nx) * 4;

                    // Calcula a intensidade mínima para erosão
                    minIntensity = Math.min(minIntensity, data[offset]);
                }

                // Define o pixel erodido
                let index = (y * width + x) * 4;
                erodedData[index] = minIntensity;      // Red
                erodedData[index + 1] = minIntensity;  // Green
                erodedData[index + 2] = minIntensity;  // Blue
                erodedData[index + 3] = 255;           // Alpha
            }
        }

        return new ImageData(erodedData, width, height);
    }
}