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

    function applyGaussianFilter() {
        if (!currentImageData) return;
        const width = currentImageData.width;
        const height = currentImageData.height;
        const newImageData = ctxResult.createImageData(width, height);

        const kernel = [
            [1, 4, 6, 4, 1],
            [4, 16, 24, 16, 4],
            [6, 24, 36, 24, 6],
            [4, 16, 24, 16, 4],
            [1, 4, 6, 4, 1]
        ]
        const kernelSum = 256; // Soma dos pesos para normalização

        for (let i = 2; i < height - 2; i++) {
            for (let j = 2; j < width - 2; j++) {
                let red = 0, green = 0, blue = 0;

                // Aplicação do kernel 5x5
                for (let ki = -2; ki <= 2; ki++) {
                    for (let kj = -2; kj <= 2; kj++) {
                        const pixelIndex = ((i + ki) * width + (j + kj)) * 4;
                        const weight = kernel[ki + 2][kj + 2];

                        red += currentImageData.data[pixelIndex] * weight;
                        green += currentImageData.data[pixelIndex + 1] * weight;
                        blue += currentImageData.data[pixelIndex + 2] * weight;
                    }
                }

                const index = (i * width + j) * 4;
                newImageData.data[index] = red / kernelSum;
                newImageData.data[index + 1] = green / kernelSum;
                newImageData.data[index + 2] = blue / kernelSum;
                newImageData.data[index + 3] = 255; // Alpha (opaco)
            }
        }
        ctxResult.putImageData(newImageData, 0, 0);
    }
}
