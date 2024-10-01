window.onload = function() {
    // Obtém referências para os elementos canvas e botões do HTML
    const originalCanvas = document.getElementById('originalCanvas');
    const equalizedCanvas = document.getElementById('equalizedCanvas');
    const originalContext = originalCanvas.getContext('2d');
    const equalizedContext = equalizedCanvas.getContext('2d');
    const imageLoader = document.getElementById('imageLoader');
    const equalizeButton = document.getElementById('equalizeButton');

    // Adiciona evento de "change" para carregar a imagem no canvas
    imageLoader.addEventListener('change', handleImage);
    // Adiciona evento de "click" para equalizar o histograma
    equalizeButton.addEventListener('click', equalizeHistogram);

    // Função para ler e exibir a imagem no canvas original
    function handleImage(event) {
        const reader = new FileReader(); // Usado para ler o arquivo de imagem
        reader.onload = (e) => {
            const img = new Image(); // Cria um novo objeto de imagem
            img.onload = () => {
                // Define a largura e altura dos dois canvas conforme a imagem
                [originalCanvas, equalizedCanvas].forEach(canvas => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                });
                // Desenha a imagem carregada no canvas original
                originalContext.drawImage(img, 0, 0);
                // Habilita o botão de equalização depois que a imagem é carregada
                equalizeButton.disabled = false;
            };
            // Define a imagem como a base64 lida do arquivo
            img.src = e.target.result;
        };
        // Lê o arquivo de imagem selecionado pelo usuário
        reader.readAsDataURL(event.target.files[0]);
    }

    // Função para equalizar o histograma da imagem
    function equalizeHistogram() {
        // Obtém os dados da imagem do canvas original
        const { data, width, height } = originalContext.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        const histogram = new Array(256).fill(0); // Array para armazenar o histograma (256 tons de cinza)
        const cdf = new Array(256).fill(0); // Array para armazenar a CDF (Função de Distribuição Acumulada)
        
        // Constroi o histograma: conta quantos pixels possuem cada nível de brilho (0 a 255)
        for (let i = 0; i < data.length; i += 4) {
            histogram[data[i]]++; // Usa o canal R (vermelho) para representar o brilho
        }

        // Constroi a CDF: soma cumulativa dos valores do histograma
        cdf[0] = histogram[0];
        for (let i = 1; i < 256; i++) {
            cdf[i] = cdf[i - 1] + histogram[i];
        }

        // Normaliza a CDF para mapear os valores de 0 a 255
        const cdfMin = cdf.find(v => v !== 0); // Obtém o primeiro valor não nulo da CDF
        const totalPixels = (width * height); // Número total de pixels na imagem

        // Ajusta a CDF para usar como transformação de brilho
        for (let i = 0; i < 256; i++) {
            cdf[i] = Math.round(((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * 255);
        }

        // Aplica a transformação de equalização de histograma nos dados da imagem
        for (let i = 0; i < data.length; i += 4) {
            const newBrightness = cdf[data[i]]; // Mapeia o brilho atual para o novo brilho
            // Define o novo valor de brilho para os canais R, G e B
            data[i] = data[i + 1] = data[i + 2] = newBrightness;
        }

        // Atualiza o canvas equalizado com os novos dados da imagem
        equalizedContext.putImageData(new ImageData(data, width, height), 0, 0);
    }
};
