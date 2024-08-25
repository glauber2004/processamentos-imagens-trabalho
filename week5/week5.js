window.onload = function() {
    //let originalCanvas = document.getElementById('originalCanvas');
    let originalContext = imgOrigin.getContext('2d');
    //let imageLoader = document.getElementById('imageLoader');
    //let invertButton = document.getElementById('invertButton');
    
    let img = null;

    imageLoader.addEventListener('change', treatImage, false);
    invertButtonHorizontally.addEventListener('click', invertImageHorizontally, false);
    invertButtonVertically.addEventListener('click', invertImageVertically, false);

    //função ler a imagem
    function treatImage(changeEvent) {
        let reader = new FileReader();
        reader.onload = function(event) {
            img = new Image();
            img.onload = function() {
                
                imgOrigin.width = img.width;
                imgOrigin.height = img.height;

                //imagem original
                originalContext.drawImage(img, 0, 0);
            }
            img.src = event.target.result;
        }
        reader.readAsDataURL(changeEvent.target.files[0]);
    }

    //função para inverter a imagem horizontalmente
    function invertImageHorizontally() {
        //dados da imagem padrão
        let imageData = originalContext.getImageData(0, 0, img.width, img.height);
        let data = imageData.data;

        //loop pra percorrer e inverter a imagem
        for (let y = 0; y < img.height; y++) {
            for (let x = 0; x < img.width / 2; x++) {
                //pixels para troca
                let leftIndex = (y * img.width + x) * 4;
                let rightIndex = (y * img.width + (img.width - x - 1)) * 4;

                //trocar os valores dos pixels
                for (let i = 0; i < 4; i++) {
                    let temp = data[leftIndex + i];
                    data[leftIndex + i] = data[rightIndex + i];
                    data[rightIndex + i] = temp;
                }
            }
        }

        //exibir a imagem de volta
        originalContext.putImageData(imageData, 0, 0);
    }


    //função para inverter a imagem verticalmente
function invertImageVertically() {

    //dados da imagem padrão
    let imageData = originalContext.getImageData(0, 0, img.width, img.height);
    let data = imageData.data;

    //loop pra percorrer e inverter a imagem
    for (let y = 0; y < img.height / 2; y++) {
        for (let x = 0; x < img.width; x++) {
            //pixels para troca
            let topIndex = (y * img.width + x) * 4;
            let bottomIndex = ((img.height - y - 1) * img.width + x) * 4;

            //trocar os valores dos pixels
            for (let i = 0; i < 4; i++) {
                let temp = data[topIndex + i];
                data[topIndex + i] = data[bottomIndex + i];
                data[bottomIndex + i] = temp;
            }
        }
    }

    //exibir a imagem de volta
    originalContext.putImageData(imageData, 0, 0);
}
}


//função para baixar a nova imagem 
function downloadImage() {
    const resultCanvas = document.getElementById('imgOrigin');
    const downloadLink = document.createElement('a');

    //converter canvas para URL
    downloadLink.href = resultCanvas.toDataURL('image/jpg');
    downloadLink.download = 'image_invert.jpg';
    downloadLink.click();
}

//botão de download 
document.getElementById('downloadButton').addEventListener('click', downloadImage);