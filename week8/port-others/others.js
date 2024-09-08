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
        };
    };
    reader.readAsDataURL(imageFile);
}

//função and
function andImages() {
    // array para manter valores (0 até 255)
    const andData = new Uint8ClampedArray(image1Data.length);

    //laço de repetição para pegar pixel a pixel
    for (let i = 0; i < image1Data.length; i += 4) {
        andData[i] = (image1Data[i] === 255 && image2Data[i] === 255) ? 255 : 0;
        andData[i + 1] = (image1Data[i] === 255 && image2Data[i] === 255) ? 255 : 0;
        andData[i + 2] = (image1Data[i] === 255 && image2Data[i] === 255) ? 255 : 0;
        andData[i + 3] = 255;
    }

    // Renderizar a nova imagem, resultado do AND
    const resultCanvas = document.getElementById('resultCanvas');
    resultCanvas.width = image1Width;
    resultCanvas.height = image1Height;
    const resultCtx = resultCanvas.getContext('2d');

    // Mostrar a imagem nova
    const resultImageData = resultCtx.createImageData(image1Width, image1Height);
    resultImageData.data.set(andData);
    resultCtx.putImageData(resultImageData, 0, 0);
}

//função or
function orImages() {
    // array para manter valores (0 até 255)
    const orData = new Uint8ClampedArray(image1Data.length);

    //laço de repetição para pegar pixel a pixel
    for (let i = 0; i < image1Data.length; i += 4) {
        orData[i] = (image1Data[i] === 0 && image2Data[i] === 0) ? 0 : 255;
        orData[i + 1] = (image1Data[i] === 0 && image2Data[i] === 0) ? 0 : 255;
        orData[i + 2] = (image1Data[i] === 0 && image2Data[i] === 0) ? 0 : 255;
        orData[i + 3] = 255;
    }

    // Renderizar a nova imagem, resultado do or
    const resultCanvas = document.getElementById('resultCanvas');
    resultCanvas.width = image1Width;
    resultCanvas.height = image1Height;
    const resultCtx = resultCanvas.getContext('2d');

    // Mostrar a imagem nova
    const resultImageData = resultCtx.createImageData(image1Width, image1Height);
    resultImageData.data.set(orData);
    resultCtx.putImageData(resultImageData, 0, 0);
}

//função xor
function xorImages() {
    // array para manter valores (0 até 255)
    const xorData = new Uint8ClampedArray(image1Data.length);

    //laço de repetição para pegar pixel a pixel
    for (let i = 0; i < image1Data.length; i += 4) {
        xorData[i] = (image1Data[i] == image2Data[i]) ? 0 : 255;
        xorData[i + 1] = (image1Data[i] == image2Data[i]) ? 0 : 255;
        xorData[i + 2] = (image1Data[i] == image2Data[i]) ? 0 : 255;
        xorData[i + 3] = 255;
    }

    // Renderizar a nova imagem, resultado do or
    const resultCanvas = document.getElementById('resultCanvas');
    resultCanvas.width = image1Width;
    resultCanvas.height = image1Height;
    const resultCtx = resultCanvas.getContext('2d');

    // Mostrar a imagem nova
    const resultImageData = resultCtx.createImageData(image1Width, image1Height);
    resultImageData.data.set(xorData);
    resultCtx.putImageData(resultImageData, 0, 0);
}

//função para baixar a nova imagem 
function downloadImage() {
    const resultCanvas = document.getElementById('resultCanvas');
    const downloadLink = document.createElement('a');

    //converter canvas para URL
    downloadLink.href = resultCanvas.toDataURL('image/png');
    downloadLink.download = 'image_port.png';
    downloadLink.click();
}

//botão de download 
document.getElementById('downloadButton').addEventListener('click', downloadImage);
