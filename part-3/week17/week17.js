// Função de carregamento da imagem
window.onload = function() {
    let originalCanvas = document.getElementById('originalCanvas');
    let originalContext = originalCanvas.getContext('2d');
    let edgeCanvas = document.getElementById('edgeCanvas');
    let edgeContext = edgeCanvas.getContext('2d');
    let imageLoader = document.getElementById('imageLoader');
    let edgeButton = document.getElementById('edgeButton');

    imageLoader.addEventListener('change', treatImage, false);
    edgeButton.addEventListener('click', applySobelEdgeDetection, false);

    // Função para ler e exibir a imagem carregada
    function treatImage(event) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                originalCanvas.width = img.width;
                originalCanvas.height = img.height;
                edgeCanvas.width = img.width;
                edgeCanvas.height = img.height;
                originalContext.drawImage(img, 0, 0);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    // Função para aplicar a detecção de bordas usando o operador Sobel
    function applySobelEdgeDetection() {
        let width = originalCanvas.width;
        let height = originalCanvas.height;
        let imageData = originalContext.getImageData(0, 0, width, height);
        let data = imageData.data;
        let edgeData = new Uint8ClampedArray(data.length);

        // Máscaras Sobel para direções x e y
        const h1 = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
        const h2 = [
            [1, 2, 1],
            [0, 0, 0],
            [-1, -2, -1]
        ];

        // Função auxiliar para obter o índice de um pixel no array de dados
        function getIndex(x, y) {
            return (y * width + x) * 4;
        }

        // Loop pelos pixels, aplicando o operador Sobel
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                let gx = 0;
                let gy = 0;

                // Aplicar a máscara em torno do pixel
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        let pixelIndex = getIndex(x + j, y + i);
                        let intensity = data[pixelIndex]; // apenas o canal vermelho

                        gx += h1[i + 1][j + 1] * intensity;
                        gy += h2[i + 1][j + 1] * intensity;
                    }
                }

                // Cálculo da magnitude do gradiente
                let magnitude = Math.sqrt(gx * gx + gy * gy);
                let clampedValue = Math.min(255, Math.max(0, magnitude));

                // Definir o valor de borda para o pixel de saída
                let outputIndex = getIndex(x, y);
                edgeData[outputIndex] = clampedValue;       // R
                edgeData[outputIndex + 1] = clampedValue;   // G
                edgeData[outputIndex + 2] = clampedValue;   // B
                edgeData[outputIndex + 3] = 255;            // Alpha
            }
        }

        // Copiar os dados processados para o canvas de borda
        let edgeImageData = new ImageData(edgeData, width, height);
        edgeContext.putImageData(edgeImageData, 0, 0);
    }
};


//função para baixar a nova imagem 
function downloadImage() {
    const edgeCanvas = document.getElementById('edgeCanvas');
    const downloadLink = document.createElement('a');
    downloadLink.href = edgeCanvas.toDataURL('image/jpg');
    downloadLink.download = 'image_sobel.jpg';
    downloadLink.click();
}
document.getElementById('downloadButton').addEventListener('click', downloadImage);