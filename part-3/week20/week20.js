window.onload = function() {
    let originalCanvas = document.getElementById('originalCanvas');
    let originalContext = originalCanvas.getContext('2d');
    let erodedCanvas = document.getElementById('erodedCanvas');
    let erodedContext = erodedCanvas.getContext('2d');
    let imageLoader = document.getElementById('imageLoader');
    let erodeButton = document.getElementById('erodeButton');

    imageLoader.addEventListener('change', treatImage, false);
    erodeButton.addEventListener('click', erodeImage);

    // Função para ler a imagem fornecida
    function treatImage(changeEvent) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                // Ajusta o tamanho dos canvas para o tamanho da imagem
                originalCanvas.width = img.width;
                originalCanvas.height = img.height;
                erodedCanvas.width = img.width;
                erodedCanvas.height = img.height;

                // Desenha a imagem original no primeiro canvas
                originalContext.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(changeEvent.target.files[0]);
    }

    // Função para realizar a erosão
    function erodeImage() {
        let imageData = originalContext.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        let data = imageData.data;
        let erodedData = new Uint8ClampedArray(data);

        // Define o elemento estruturante 3x3
        let structureElement = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 0], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        for (let y = 1; y < originalCanvas.height - 1; y++) {
            for (let x = 1; x < originalCanvas.width - 1; x++) {
                let minIntensity = 255;

                // Percorre o elemento estruturante
                for (let i = 0; i < structureElement.length; i++) {
                    let dx = structureElement[i][0];
                    let dy = structureElement[i][1];
                    let nx = x + dx;
                    let ny = y + dy;
                    let offset = (ny * originalCanvas.width + nx) * 4;

                    // Calcula a intensidade mínima para erosão
                    minIntensity = Math.min(minIntensity, data[offset]);
                }

                // Define o pixel erodido
                let index = (y * originalCanvas.width + x) * 4;
                erodedData[index] = minIntensity;      // Red
                erodedData[index + 1] = minIntensity;  // Green
                erodedData[index + 2] = minIntensity;  // Blue
                erodedData[index + 3] = 255;           // Alpha
            }
        }

        // Aplica a imagem erodida no canvas de saída
        erodedContext.putImageData(new ImageData(erodedData, originalCanvas.width, originalCanvas.height), 0, 0);
    }
}


//função para baixar a nova imagem 
function downloadImage() {
    const erodedCanvas = document.getElementById('erodedCanvas');
    const downloadLink = document.createElement('a');
    downloadLink.href = erodedCanvas.toDataURL('image/jpg');
    downloadLink.download = 'image_eroded.jpg';
    downloadLink.click();
} 
document.getElementById('downloadButton').addEventListener('click', downloadImage);