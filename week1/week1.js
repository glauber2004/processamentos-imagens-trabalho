// Normalizar valor RGB
function normalize() {
    let r = parseFloat(document.getElementById('r1').value);
    let g = parseFloat(document.getElementById('g1').value);
    let b = parseFloat(document.getElementById('b1').value);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        document.getElementById('result').innerText = "Por favor, insira todos os valores RGB.";
        return;
    }

    r = r / 255;
    g = g / 255;
    b = b / 255;

    document.getElementById('result').innerText = `Normalizado: R=${r.toFixed(2)}, G=${g.toFixed(2)}, B=${b.toFixed(2)}`;
}

// Converter valor RGB
function convertRGB() {
    let r = parseFloat(document.getElementById('r2').value);
    let g = parseFloat(document.getElementById('g2').value);
    let b = parseFloat(document.getElementById('b2').value);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        document.getElementById('resultRGB').innerText = "Por favor, insira todos os valores RGB.";
        return;
    }

    document.getElementById('resultRGB').innerText = `RGB: R=${r}, G=${g}, B=${b}`;
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

    // Conversão de HSV para RGB
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

    document.getElementById('resultHSV').innerText = `RGB: R=${r}, G=${g}, B=${b}`;
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

    document.getElementById('resultCMYK').innerText = `RGB: R=${Math.round(r)}, G=${Math.round(g)}, B=${Math.round(b)}`;
}
