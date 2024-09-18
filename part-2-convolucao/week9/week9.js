window.onload = function() {
  let originalCanvas = document.getElementById('originalCanvas');
  let equalizedCanvas = document.getElementById('equalizedCanvas');
  let originalContext = originalCanvas.getContext('2d');
  let equalizedContext = equalizedCanvas.getContext('2d');
  let imageLoader = document.getElementById('imageLoader');

  imageLoader.addEventListener('change', treatImage, false);

  // Função para ler e tratar a imagem fornecida
  function treatImage(changeEvent) {
      let reader = new FileReader(); // Objeto para conseguir base64
      reader.onload = function(event) {
          let img = new Image();
          img.onload = function() {
              // Ajusta o tamanho dos canvas para o tamanho da imagem
              originalCanvas.width = img.width;
              originalCanvas.height = img.height;
              equalizedCanvas.width = img.width;
              equalizedCanvas.height = img.height;

              // Desenha a imagem original no primeiro canvas
              originalContext.drawImage(img, 0, 0);

              // Processa a equalização de histograma
              equalizeHistogram();
          }
          img.src = event.target.result;
      }
      reader.readAsDataURL(changeEvent.target.files[0]);
  }

  // Função de equalização de histograma
  function equalizeHistogram() {
      // Obter os dados da imagem original
      let imageData = originalContext.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
      let data = imageData.data;

      // Criar o histograma
      let histogram = new Array(256).fill(0);
      
      // Construir o histograma
      for (let i = 0; i < data.length; i += 4) {
          let brightness = data[i]; // Canal vermelho representa o brilho
          histogram[brightness]++;
      }

      // Calcular a CDF (Função de Distribuição Acumulada)
      let cdf = new Array(256).fill(0);
      cdf[0] = histogram[0];

      for (let i = 1; i < 256; i++) {
          cdf[i] = cdf[i - 1] + histogram[i];
      }

      // Normalizar a CDF
      let cdfMin = cdf.find(value => value !== 0); // Primeiro valor não zero da CDF
      let totalPixels = data.length / 4; // Número total de pixels
      for (let i = 0; i < 256; i++) {
          cdf[i] = Math.round(((cdf[i] - cdfMin) / (totalPixels - cdfMin)) * 255);
      }

      // Aplicar a equalização de histograma
      for (let i = 0; i < data.length; i += 4) {
          let brightness = data[i];
          let newBrightness = cdf[brightness];

          // Aplicar o novo valor de brilho nos canais R, G e B
          data[i] = data[i + 1] = data[i + 2] = newBrightness;
      }

      // Colocar a imagem equalizada no segundo canvas
      equalizedContext.putImageData(imageData, 0, 0);
  }
}