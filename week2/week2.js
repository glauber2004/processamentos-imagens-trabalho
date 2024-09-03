//função de carregamento quando a página estiver pronta
window.onload = function() {
    let originalCanvas = document.getElementById('originalCanvas');
    let grayCanvas = document.getElementById('grayCanvas');
    let originalContext = originalCanvas.getContext('2d');
    let grayContext = grayCanvas.getContext('2d');
    let imageLoader = document.getElementById('imageLoader');

    imageLoader.addEventListener('change', treatImage, false);

    //função para ler a imagem fornecida
    function treatImage(changeEvent) {
        let reader = new FileReader(); // objeto para conseguir base64
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                //ajusta o tamanho dos canvas para o tamanho da imagem
                originalCanvas.width = grayCanvas.width = img.width;
                originalCanvas.height = grayCanvas.height = img.height;

                //desenha a imagem original no primeiro canvas
                originalContext.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(changeEvent.target.files[0]);
    }

    window.convertToGrayScale = function() {
        // Obter os dados da imagem original
        let imageData = originalContext.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        let pixels = imageData.data;

        // Loop através de todos os pixels
        for (let y = 0; y < originalCanvas.height; y++) {
            for (let x = 0; x < originalCanvas.width; x++) {
                let index = (y * originalCanvas.width + x) * 4;
                let r = pixels[index];     
                let g = pixels[index + 1]; 
                let b = pixels[index + 2]; 

                // Calcula o valor da escala de cinza
                /*  let gray = 0.3 * r + 0.59 * g + 0.11 * b; */
                let gray = (r+g+b)/3;

                // Define os valores R, G, B para o valor de cinza
                pixels[index] = pixels[index + 1] = pixels[index + 2] = gray;
            }
        }

        // Coloca os dados de volta no canvas de escala de cinza
        grayContext.putImageData(imageData, 0, 0);
    };
}

//função para baixar a nova imagem 
function downloadImage() {
    const grayCanvas = document.getElementById('grayCanvas');
    const downloadLink = document.createElement('a');

    //converter canvas para URL
    downloadLink.href = grayCanvas.toDataURL('image/jpg');
    downloadLink.download = 'image_gray_scale.jpg';
    downloadLink.click();
}

//botão de download 
document.getElementById('downloadButton').addEventListener('click', downloadImage);
