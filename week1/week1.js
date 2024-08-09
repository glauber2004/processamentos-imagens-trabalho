//normalizar valor RGB
function normalize() {
    let r = document.getElementById('r1').value;
    let g = document.getElementById('g1').value;
    let b = document.getElementById('b1').value;

    r = r / 255;
    g = g / 255;
    b = b / 255;

    console.log(`Normalizado: R=${r}, G=${g}, B=${b}`);
}

//converter valor RGB
function convertRGB() {
    let r = document.getElementById('r2').value;
    let g = document.getElementById('g2').value;
    let b = document.getElementById('b2').value;

    console.log(`Converter RGB: R=${r}, G=${g}, B=${b}`);

}

//converter HSV para RGB
function convertHSV() {
    let h = document.getElementById('h').value;
    let s = document.getElementById('s').value;
    let v = document.getElementById('v').value;

    console.log(`Converter HSV para RGB: H=${h}, S=${s}, V=${v}`);
}

//converter CMYK para RGB
function convertCMYK() {
    let c = document.getElementById('c').value;
    let m = document.getElementById('m').value;
    let y = document.getElementById('y').value;

    console.log(`Converter CMYK para RGB: C=${c}, M=${m}, Y=${y}`);
    
}
