const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 192x192 PNG minimal valid image or amber circle PNG
// Base64 valid 192x192 PNG
const pngBase64 = 
  'iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAIAAAAs/+N9AAABgGlDQ1BJQ0MgcHJvZmlsZQAAKJF9' +
  'kT1Iw0AcxV9TpUUVBzsUCVLE6mBBVMRRqlgEC4Wt0KqDiaXf0KQhSXFxFFwLDn4sVh1cnHV1cBEE' +
  'wQ8QJxcnRRcp8X9JoUWMB8f9eHfvcfcO8DeqTDW7YgDUbCudTEjMZFfFwCsCEEIMg1hcmdnMTFKS' +
  'v8d1Dx9f72I8y/vcv2NAyZkM8InEM0w3bOJ14qlNW+e8TxxmZVKRPicOm7TB4keuqzG+45xwWOCZ' +
  'YSOTmicOEYuFDpY7mJUNlXiKOKKoGuX7Mx4rnLc4a5U6a96TvzCU05aXuc5qBAuIYgkiBMiooIoK' +
  'bMTp1FExkaTz2Md/yPGL5JLIVQEjxwLKUCAG3/wPfs/Wyk1MeEnxJND74rgfI8DQLdBqOO772HGa' +
  'J4D/GbjSmv56C5j9JL3e1KJHwP/twEV105P3gMsdYPAhF33JkYLUwnw+uB7Pv6kC/LdA75pz19rn' +
  '6AOUyKzqDXBwCIwWKHvd493dnb39e6bV3w8853Kz81N/ngAAAAlwSFlzAAALEwAACxMBAJqcGAAA' +
  'AAd0SU1FB+kDGw0oE8h3s60AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA' +
  'LklEQVR42u3BAQ0AAADCoPdPbQ43oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPwYxP4AAfW2' +
  't84AAAAASUVORK5CYII=';

const buffer = Buffer.from(pngBase64, 'base64');

fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), buffer);
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), buffer);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'), buffer);

console.log('Icons generated successfully');
