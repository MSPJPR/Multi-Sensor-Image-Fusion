const fuseBtn = document.getElementById('fuseBtn');
const downloadBtn = document.getElementById('downloadBtn');
const fusionType = document.getElementById('fusionType');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const progress = document.getElementById('progress');
let img1 = null;
let img2 = null;

document.getElementById('image1').addEventListener('change', (e) => loadImage(e, 'img1'));
document.getElementById('image2').addEventListener('change', (e) => loadImage(e, 'img2'));

function loadImage(event, imgVar) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            if (imgVar === 'img1') img1 = img;
            if (imgVar === 'img2') img2 = img;
        };
    };
    reader.readAsDataURL(event.target.files[0]);
}

fuseBtn.addEventListener('click', () => {
    if (img1 && img2) {
        progress.classList.remove('hidden');
        setTimeout(() => {
            fuseImages(img1, img2, fusionType.value);
            progress.classList.add('hidden');
            downloadBtn.disabled = false;
        }, 500);
    } else {
        alert('Please upload two images.');
    }
});

function fuseImages(image1, image2, type) {
    const width = Math.min(image1.width, image2.width);
    const height = Math.min(image1.height, image2.height);

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image1, 0, 0, width, height);
    const imgData1 = ctx.getImageData(0, 0, width, height);

    ctx.drawImage(image2, 0, 0, width, height);
    const imgData2 = ctx.getImageData(0, 0, width, height);

    const fusedData = ctx.createImageData(width, height);

    for (let i = 0; i < imgData1.data.length; i += 4) {
        if (type === 'average') {
            fusedData.data[i] = (imgData1.data[i] + imgData2.data[i]) / 2; // Red
            fusedData.data[i + 1] = (imgData1.data[i + 1] + imgData2.data[i + 1]) / 2; // Green
            fusedData.data[i + 2] = (imgData1.data[i + 2] + imgData2.data[i + 2]) / 2; // Blue
        } else if (type === 'laplacian') {
            fusedData.data[i] = Math.abs(imgData1.data[i] - imgData2.data[i]); // Red
            fusedData.data[i + 1] = Math.abs(imgData1.data[i + 1] - imgData2.data[i + 1]); // Green
            fusedData.data[i + 2] = Math.abs(imgData1.data[i + 2] - imgData2.data[i + 2]); // Blue
        }
        fusedData.data[i + 3] = 255; // Alpha
    }

    ctx.putImageData(fusedData, 0, 0);
}

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'fused_image.png';
    link.href = canvas.toDataURL();
    link.click();
});
