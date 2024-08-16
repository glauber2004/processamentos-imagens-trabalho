function processImages() {
    const image1 = document.getElementById('image1').files[0];
    const image2 = document.getElementById('image2').files[0];

    if (image1 && image2) {
        loadImageAndLogRGB(image1, 'Image 1', 'displayImage1');
        loadImageAndLogRGB(image2, 'Image 2', 'displayImage2');
    } else {
        console.log("Por favor, selecione duas imagens.");
    }
}

function loadImageAndLogRGB(imageFile, label, displayId) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        document.getElementById(displayId).src = event.target.result; // Exibir a imagem

        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Obter dados da imagem
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imageData.data;

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