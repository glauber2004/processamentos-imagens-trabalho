// carregar a imagem
document.getElementById('image').addEventListener('change', function() {
    loadImageAndLogRGB(this.files[0], 'Image', 'displayImage');
});