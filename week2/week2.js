window.onload = function() {
    let originalCanvas = document.getElementById('originalCanvas');
    let grayCanvas = document.getElementById('grayCanvas');
    let originalContext = originalCanvas.getContext('2d');
    let grayContext = grayCanvas.getContext('2d');
    let imageLoader = document.getElementById('imageLoader');

    imageLoader.addEventListener('change', handleImage, false);

    function handleImage(e) {
        let reader = new FileReader();
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                // Ajusta o tamanho dos canvas para o tamanho da imagem
                originalCanvas.width = grayCanvas.width = img.width;
                originalCanvas.height = grayCanvas.height = img.height;

                // Desenha a imagem original no primeiro canvas
                originalContext.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    window.convertToGrayScale = function() {
        // Obter os dados da imagem original
        let imageData = originalContext.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        let pixels = imageData.data;

        // Matrizes para R, G, B
        let matrixR = [];
        let matrixG = [];
        let matrixB = [];

        // Loop através de todos os pixels
        for (let y = 0; y < originalCanvas.height; y++) {
            let rowR = [];
            let rowG = [];
            let rowB = [];
            for (let x = 0; x < originalCanvas.width; x++) {
                let index = (y * originalCanvas.width + x) * 4;
                let r = pixels[index];     
                let g = pixels[index + 1]; 
                let b = pixels[index + 2]; 

                rowR.push(r);
                rowG.push(g);
                rowB.push(b);

                // Calcula o valor da escala de cinza
                let gray = 0.3 * r + 0.59 * g + 0.11 * b;

                // Define os valores R, G, B para o valor de cinza
                pixels[index] = pixels[index + 1] = pixels[index + 2] = gray;
            }
            matrixR.push(rowR);
            matrixG.push(rowG);
            matrixB.push(rowB);
        }

        // Coloca os dados de volta no canvas de escala de cinza
        grayContext.putImageData(imageData, 0, 0);

        // Mostra as matrizes RGB no console
        console.log('Matrix R:', matrixR);
        console.log('Matrix G:', matrixG);
        console.log('Matrix B:', matrixB);
    };
}
