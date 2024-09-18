//carregar as imagens
document.getElementById('image1').addEventListener('change', function() {
    loadImageAndLogRGB(this.files[0], 'Image 1', 'displayImage1');
});

document.getElementById('image2').addEventListener('change', function() {
    loadImageAndLogRGB(this.files[0], 'Image 2', 'displayImage2');
});


// armazenar os dados dos pixels das duas imagens carregadas.
let image1Data, image2Data;
let image1Width, image1Height, image2Width, image2Height;
let imageCData, imageDData;


//função inicial criar o necessário para mostrar a imagem e converter em RGBA (matriz)
function loadImageAndLogRGB(imageFile, label, displayId) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        document.getElementById(displayId).src = event.target.result;

        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;

            if (label === 'Image 1') {
                image1Data = data;
                image1Width = img.width;
                image1Height = img.height;
            } else {
                image2Data = data;
                image2Width = img.width;
                image2Height = img.height;
            }
        };
    };
    reader.readAsDataURL(imageFile);
}


//função subtrair Image1 de Image2
function subtractImages() {
    if (!image1Data || !image2Data) {
        console.log("Imagens não carregadas corretamente.");
        return;
    }

    // array pra manter valores (0 até 255)
    const subtractedData = new Uint8ClampedArray(image1Data.length);

    //laço de repetição para percorrer e subtrair os pixels
    for (let i = 0; i < image1Data.length; i += 4) {
        subtractedData[i] = Math.max(image1Data[i] - image2Data[i], 0);
        subtractedData[i + 1] = Math.max(image1Data[i + 1] - image2Data[i + 1], 0);
        subtractedData[i + 2] = Math.max(image1Data[i + 2] - image2Data[i + 2], 0);
        subtractedData[i + 3] = 255;
        //em ordem RGBA - A=alpha
    }

    //armazenar o resultado em imageCData e renderizar
    imageCData = subtractedData;
    const resultCanvas = document.getElementById('resultC');
    resultCanvas.width = image1Width;
    resultCanvas.height = image1Height;
    const resultCtx = resultCanvas.getContext('2d');

    //mostrar a imagem nova
    const resultImageData = resultCtx.createImageData(image1Width, image1Height);
    resultImageData.data.set(subtractedData);
    resultCtx.putImageData(resultImageData, 0, 0);
}

//função subtrair Image2 de Image1
function subtractImages2() {
    if (!image1Data || !image2Data) {
        console.log("Imagens não carregadas corretamente.");
        return;
    }

    // array pra manter valores (0 até 255)
    const subtractedData = new Uint8ClampedArray(image2Data.length);

    //laço de repetição para percorrer e subtrair os pixels
    for (let i = 0; i < image2Data.length; i += 4) {
        subtractedData[i] = Math.max(image2Data[i] - image1Data[i], 0);
        subtractedData[i + 1] = Math.max(image2Data[i + 1] - image1Data[i + 1], 0);
        subtractedData[i + 2] = Math.max(image2Data[i + 2] - image1Data[i + 2], 0);
        subtractedData[i + 3] = 255;
        //em ordem RGBA - A=alpha
    }

    ////armazenar o resultado em imageDData e renderizar
    imageDData = subtractedData;
    const resultCanvas = document.getElementById('resultD');
    resultCanvas.width = image2Width;
    resultCanvas.height = image2Height;
    const resultCtx = resultCanvas.getContext('2d');

    //mostrar a imagem nova
    const resultImageData = resultCtx.createImageData(image2Width, image2Height);
    resultImageData.data.set(subtractedData);
    resultCtx.putImageData(resultImageData, 0, 0);
}

//função somar (C + D)
function sumImages() {
    if (!imageCData || !imageDData) {
        console.log("Resultados das subtrações não carregados corretamente.");
        return;
    }

    // array pra manter valores (0 até 255)
    const summedData = new Uint8ClampedArray(imageCData.length);

    //laço de repetição para percorrer e somar os pixels
    for (let i = 0; i < imageCData.length; i += 4) {
        summedData[i] = Math.min(imageCData[i] + imageDData[i], 255);
        summedData[i + 1] = Math.min(imageCData[i + 1] + imageDData[i + 1], 255);
        summedData[i + 2] = Math.min(imageCData[i + 2] + imageDData[i + 2], 255);
        summedData[i + 3] = 255;
    }

    //renderizar a nova imagem, resultado da soma
    const resultCanvas = document.getElementById('resultE');
    resultCanvas.width = image1Width;
    resultCanvas.height = image1Height;
    const resultCtx = resultCanvas.getContext('2d');

    //mostrar a imagem nova
    const resultImageData = resultCtx.createImageData(image1Width, image1Height);
    resultImageData.data.set(summedData);
    resultCtx.putImageData(resultImageData, 0, 0);
}

//função para baixar a nova imagem 
function downloadImage() {
    const resultCanvas = document.getElementById('resultE');
    const downloadLink = document.createElement('a');

    //converter canvas para URL
    downloadLink.href = resultCanvas.toDataURL('image/jpg');
    downloadLink.download = 'image_E.jpg';
    downloadLink.click();
}

//botão de download 
document.getElementById('downloadButton').addEventListener('click', downloadImage);