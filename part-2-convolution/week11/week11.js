window.onload = function() {
    let originalCanvas = document.getElementById('originalCanvas');
    let originalContext = originalCanvas.getContext('2d');
    let imageLoader = document.getElementById('imageLoader');

    imageLoader.addEventListener('change', treatImage, false);

    function treatImage(changeEvent) {
        let reader = new FileReader(); // objeto para conseguir base64
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                // ajusta o tamanho do canvas para o tamanho da imagem
                originalCanvas.width = img.width;
                originalCanvas.height = img.height;

                // desenha a imagem original no canvas
                originalContext.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(changeEvent.target.files[0]);
    }

    // Função para aplicar o filtro de convolução
    function applyConvolutionFilter(type) {
        let imageData = originalContext.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        let pixels = imageData.data;
        let width = originalCanvas.width;
        let height = originalCanvas.height;

        let newImageData = originalContext.createImageData(imageData);
        let newPixels = newImageData.data;

        let kernelSize = 3;
        let halfKernel = Math.floor(kernelSize / 2);

        for (let y = halfKernel; y < height - halfKernel; y++) {
            for (let x = halfKernel; x < width - halfKernel; x++) {
                let neighborhood = [];

                // Coleta a vizinhança 3x3
                for (let ky = -halfKernel; ky <= halfKernel; ky++) {
                    for (let kx = -halfKernel; kx <= halfKernel; kx++) {
                        let pixelIndex = ((y + ky) * width + (x + kx)) * 4;
                        let r = pixels[pixelIndex];
                        let g = pixels[pixelIndex + 1];
                        let b = pixels[pixelIndex + 2];
                        let avg = (r + g + b) / 3; // Consideramos a média das três cores
                        neighborhood.push(avg);
                    }
                }

                // Aplica o filtro desejado
                let newValue;
                if (type === 'mean') {
                    newValue = neighborhood.reduce((sum, val) => sum + val, 0) / neighborhood.length;
                } else if (type === 'max') {
                    newValue = Math.max(...neighborhood);
                } else if (type === 'min') {
                    newValue = Math.min(...neighborhood);
                }

                // Define o novo valor para o pixel (r, g, b iguais para efeito de escala de cinza)
                let newPixelIndex = (y * width + x) * 4;
                newPixels[newPixelIndex] = newPixels[newPixelIndex + 1] = newPixels[newPixelIndex + 2] = newValue;
                newPixels[newPixelIndex + 3] = 255; // Mantém a opacidade
            }
        }

        // Atualiza o canvas com os novos dados de pixels
        originalContext.putImageData(newImageData, 0, 0); // Certifique-se de usar o método correto para atualizar o canvas
    }

    // Expor a função globalmente para ser chamada pelos botões
    window.applyConvolutionFilter = applyConvolutionFilter;
}
