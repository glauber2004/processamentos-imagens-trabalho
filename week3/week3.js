//carregar as imagens
document.getElementById('image1').addEventListener('change', function() {
    loadImageAndLogRGB(this.files[0], 'Image 1', 'displayImage1');
});

document.getElementById('image2').addEventListener('change', function() {
    loadImageAndLogRGB(this.files[0], 'Image 2', 'displayImage2');
});


// armazenar os dados dos pixels das duas imagens carregadas.
let image1Data, image2Data;
let image1Width, image1Height;


//função inicial criar o necessário para mostrar a imagem e converter em RGBA (matriz)
function loadImageAndLogRGB(imageFile, label, displayId) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        document.getElementById(displayId).src = event.target.result; // Exibir a imagem

        //definir a imagem 
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Obter dados da imagem
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;

            if (label === 'Image 1') {
                image1Data = data;
                image1Width = img.width;
                image1Height = img.height;
            } else {
                image2Data = data;
            }

            // Criar matrizes R, G, B
            let redMatrix = [];
            let greenMatrix = [];
            let blueMatrix = [];

            for (let i = 0; i < img.height; i++) {
                redMatrix[i] = [];
                greenMatrix[i] = [];
                blueMatrix[i] = [];
                for (let j = 0; j < img.width; j++) {
                    const index = (i * img.width + j) * 4;
                    redMatrix[i][j] = data[index];     // R
                    greenMatrix[i][j] = data[index + 1]; // G
                    blueMatrix[i][j] = data[index + 2]; // B
                }
            }

            // Mostrar as matrizes R, G, B no console
            console.log(`${label} - Matriz Red (R):`, redMatrix);
            console.log(`${label} - Matriz Green (G):`, greenMatrix);
            console.log(`${label} - Matriz Blue (B):`, blueMatrix);
        };
    };
    reader.readAsDataURL(imageFile);
}

//função somar
function sumImages() {
    if (!image1Data || !image2Data) {
        console.log("Imagens não carregadas corretamente.");
        return;
    }

    // array pra manter valores (0 até 255)
    const summedData = new Uint8ClampedArray(image1Data.length);

    //laço de repetição para percorrer e somar os pixels
    for (let i = 0; i < image1Data.length; i += 4) {
        summedData[i] = Math.min(image1Data[i] + image2Data[i], 255);       // R
        summedData[i + 1] = Math.min(image1Data[i + 1] + image2Data[i + 1], 255); // G
        summedData[i + 2] = Math.min(image1Data[i + 2] + image2Data[i + 2], 255); // B
        summedData[i + 3] = 255; // Alpha
    }

    //renderizar a nova imagem, resultado da soma
    const resultCanvas = document.getElementById('resultCanvas');
    resultCanvas.width = image1Width;
    resultCanvas.height = image1Height;
    const resultCtx = resultCanvas.getContext('2d');

    //mostrar a imagem nova
    const resultImageData = resultCtx.createImageData(image1Width, image1Height);
    resultImageData.data.set(summedData);
    resultCtx.putImageData(resultImageData, 0, 0);
}

//função subtrair
function subtractImages() {
    if (!image1Data || !image2Data) {
        console.log("Imagens não carregadas corretamente.");
        return;
    }

    // array pra manter valores (0 até 255)
    const subtractedData = new Uint8ClampedArray(image1Data.length);

    //laço de repetição para percorrer e subtrair os pixels
    for (let i = 0; i < image1Data.length; i += 4) {
        subtractedData[i] = Math.max(image1Data[i] - image2Data[i], 0);       // R
        subtractedData[i + 1] = Math.max(image1Data[i + 1] - image2Data[i + 1], 0); // G
        subtractedData[i + 2] = Math.max(image1Data[i + 2] - image2Data[i + 2], 0); // B
        subtractedData[i + 3] = 255; // Alpha
    }

    //renderizar a nova imagem, resultado da subtração
    const resultCanvas = document.getElementById('resultCanvas');
    resultCanvas.width = image1Width;
    resultCanvas.height = image1Height;
    const resultCtx = resultCanvas.getContext('2d');

    //mostrar a imagem nova
    const resultImageData = resultCtx.createImageData(image1Width, image1Height);
    resultImageData.data.set(subtractedData);
    resultCtx.putImageData(resultImageData, 0, 0);
}
