window.onload = function () {
    const originalCanvas = document.getElementById('originalCanvas');
    const ctxOriginal = originalCanvas.getContext('2d');
    const canvasResult = document.getElementById('canvasResult');
    const ctxResult = canvasResult.getContext('2d');
    const imageLoader = document.getElementById('imageLoader');
    let currentImageData;

    imageLoader.addEventListener('change', treatImage, false);
    document.getElementById('gaussianFilterBtn').addEventListener('click', applyGaussianFilter);

    function treatImage(event) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                [originalCanvas, canvasResult].forEach(canvas => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                });

                ctxOriginal.drawImage(img, 0, 0);
                currentImageData = ctxOriginal.getImageData(0, 0, img.width, img.height);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);
    }

    function generateGaussianKernel(size, sigma) {
        const kernel = [];
        const center = Math.floor(size / 2);
        let sum = 0;

        for (let x = -center; x <= center; x++) {
            const row = [];
            for (let y = -center; y <= center; y++) {
                const value = (1 / (2 * Math.PI * sigma ** 2)) * Math.exp(-(x ** 2 + y ** 2) / (2 * sigma ** 2));
                row.push(value);
                sum += value;
            }
            kernel.push(row);
        }

        // Normalizar o kernel
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                kernel[i][j] /= sum;
            }
        }
        return kernel;
    }

    function applyGaussianFilter() {
        if (!currentImageData) return;

        const sigmaInput = document.getElementById('sigmaInput').value;
        const sigma = parseFloat(sigmaInput);
        
        if (sigma < 0 || sigma > 1) {
            alert("Por favor, insira um valor de sigma entre 0.0 e 1.0.");
            return;
        }

        const width = currentImageData.width;
        const height = currentImageData.height;
        const newImageData = ctxResult.createImageData(width, height);

        const kernelSize = 5;
        const kernel = generateGaussianKernel(kernelSize, sigma);
        const offset = Math.floor(kernelSize / 2);

        for (let i = offset; i < height - offset; i++) {
            for (let j = offset; j < width - offset; j++) {
                let red = 0, green = 0, blue = 0;

                for (let ki = -offset; ki <= offset; ki++) {
                    for (let kj = -offset; kj <= offset; kj++) {
                        const pixelIndex = ((i + ki) * width + (j + kj)) * 4;
                        const weight = kernel[ki + offset][kj + offset];

                        red += currentImageData.data[pixelIndex] * weight;
                        green += currentImageData.data[pixelIndex + 1] * weight;
                        blue += currentImageData.data[pixelIndex + 2] * weight;
                    }
                }

                const index = (i * width + j) * 4;
                newImageData.data[index] = red;
                newImageData.data[index + 1] = green;
                newImageData.data[index + 2] = blue;
                newImageData.data[index + 3] = 255; 
            }
        }
        ctxResult.putImageData(newImageData, 0, 0);
    }
}

//função para baixar a nova imagem 
function downloadImage() {
    const canvasResult = document.getElementById('canvasResult');
    const downloadLink = document.createElement('a');

    //converter canvas para URL
    downloadLink.href = canvasResult.toDataURL('image/jpg');
    downloadLink.download = 'image_gaussian.jpg';
    downloadLink.click();
}

//botão de download 
document.getElementById('downloadButton').addEventListener('click', downloadImage);