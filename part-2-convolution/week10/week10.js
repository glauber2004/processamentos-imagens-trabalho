const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let image = new Image();

// Carrega a imagem do upload
upload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        image.src = event.target.result;
        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
        }
    }

    reader.readAsDataURL(file);
});

function applyThreshold() {
    const threshold = document.getElementById('threshold').value;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        // Conversão para escala de cinza (media dos canais RGB)
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

        // Aplicação do threshold
        const value = avg >= threshold ? 255 : 0;

        data[i] = data[i + 1] = data[i + 2] = value; // Define RGB como preto ou branco
    }

    // Atualiza a imagem com o threshold aplicado
    ctx.putImageData(imageData, 0, 0);
}
