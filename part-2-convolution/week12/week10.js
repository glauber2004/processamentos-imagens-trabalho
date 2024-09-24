//função de carregamento da imagem
window.onload = function() {
    let originalCanvas = document.getElementById('originalCanvas');
    let originalContext = originalCanvas.getContext('2d');
    let imageLoader = document.getElementById('imageLoader');

    imageLoader.addEventListener('change', treatImage, false);

    //função para ler a imagem fornecida
    function treatImage(changeEvent) {
        let reader = new FileReader(); // objeto para conseguir base64
        reader.onload = function(event) {
            let img = new Image();
            img.onload = function() {
                //ajusta o tamanho dos canvas para o tamanho da imagem
                originalCanvas.width = img.width;
                originalCanvas.height = img.height;

                //desenha a imagem original no primeiro canvas
                originalContext.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(changeEvent.target.files[0]);
    }
}