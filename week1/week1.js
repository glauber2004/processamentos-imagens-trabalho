// Normalizar valor RGB
function norm(){
    let r = parseFloat(document.getElementById('r1').value);
    let g = parseFloat(document.getElementById('g1').value);
    let b = parseFloat(document.getElementById('b1').value);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        document.getElementById('resultNorm').innerText = "Por favor, insira todos os valores RGB.";
        return;
    }

    let Rnorm = r / (r+g+b);
    let Gnorm = g / (r+g+b);
    let Bnorm = b / (r+g+b);

    document.getElementById('resultNorm').innerText = `Normalizado: ${Rnorm.toFixed(2)}, ${Gnorm.toFixed(2)}, ${Bnorm.toFixed(2)}`
}

// Converter valor RGB para Escala de cinza
function convertRGBec() {
    let r = parseFloat(document.getElementById('r2').value);
    let g = parseFloat(document.getElementById('g2').value);
    let b = parseFloat(document.getElementById('b2').value);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        document.getElementById('resultGrayscale').innerText = "Por favor, insira todos os valores RGB.";
        return;
    }

    let grayscale = 0.299 * r + 0.587 * g + 0.114 * b;

    document.getElementById('resultGrayscale').innerText = `Escala Cinza: ${grayscale.toFixed(2)}`;
}

// Converter valor RGB para HSV
function convertRGBhsv() {
    let r = parseFloat(document.getElementById('r3').value) / 255;
    let g = parseFloat(document.getElementById('g3').value) / 255;
    let b = parseFloat(document.getElementById('b3').value) / 255;

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        document.getElementById('resultRGBHSV').innerText = "Por favor, insira todos os valores RGB.";
        return;
    }

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    v = Math.round(v * 100);

    document.getElementById('resultRGBHSV').innerText = `H: ${h}, S: ${s}%, V: ${v}%`;
}

// Converter valor RGB para CMYK
function convertRGBcmyk() {
    let r = parseFloat(document.getElementById('r4').value) / 255;
    let g = parseFloat(document.getElementById('g4').value) / 255;
    let b = parseFloat(document.getElementById('b4').value) / 255;

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        document.getElementById('resultRGBCMYK').innerText = "Por favor, insira todos os valores RGB.";
        return;
    }

    let k = 1 - Math.max(r, g, b);
    let c = (1 - r - k) / (1 - k);
    let m = (1 - g - k) / (1 - k);
    let y = (1 - b - k) / (1 - k);

    document.getElementById('resultRGBCMYK').innerText = `C: ${(c * 100).toFixed(2)}%, M: ${(m * 100).toFixed(2)}%, Y: ${(y * 100).toFixed(2)}%, K: ${(k * 100).toFixed(2)}%`;
}

// Converter HSV para RGB
function convertHSV() {
    let h = parseFloat(document.getElementById('h').value);
    let s = parseFloat(document.getElementById('s').value) / 100;
    let v = parseFloat(document.getElementById('v').value) / 100;

    if (isNaN(h) || isNaN(s) || isNaN(v)) {
        document.getElementById('resultHSV').innerText = "Por favor, insira todos os valores HSV.";
        return;
    }

    let c = v * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = v - c;
    let r, g, b;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else {
        r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    document.getElementById('resultHSV').innerText = `R: ${r}, G: ${g}, B: ${b}`;
}

// Converter CMYK para RGB
function convertCMYK() {
    let c = parseFloat(document.getElementById('c').value) / 100;
    let m = parseFloat(document.getElementById('m').value) / 100;
    let y = parseFloat(document.getElementById('y').value) / 100;
    let k = parseFloat(document.getElementById('k').value) / 100;

    if (isNaN(c) || isNaN(m) || isNaN(y) || isNaN(k)) {
        document.getElementById('resultCMYK').innerText = "Por favor, insira todos os valores CMYK.";
        return;
    }

    let r = 255 * (1 - c) * (1 - k);
    let g = 255 * (1 - m) * (1 - k);
    let b = 255 * (1 - y) * (1 - k);

    document.getElementById('resultCMYK').innerText = `R: ${Math.round(r)}, G: ${Math.round(g)}, B: ${Math.round(b)}`;
}
