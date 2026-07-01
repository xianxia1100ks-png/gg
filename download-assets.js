import fs from 'fs';
import path from 'path';
import https from 'https';

const assetsDir = path.resolve('assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Download function that returns a Promise
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(true));
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => rejection(err));
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading Padauk fonts for offline play...');
  try {
    // Standard Google Fonts links for Padauk
    const padaukRegUrl = 'https://fonts.gstatic.com/s/padauk/v13/or0vXPN29UveAd9-H-gq69U.ttf';
    const padaukBoldUrl = 'https://fonts.gstatic.com/s/padauk/v13/or0sXPN29UveAd9-E-In8NMy_p8.ttf';

    const regDest = path.join(assetsDir, 'Padauk-Regular.ttf');
    const boldDest = path.join(assetsDir, 'Padauk-Bold.ttf');

    console.log(`Downloading Regular font to ${regDest}...`);
    await downloadFile(padaukRegUrl, regDest);
    console.log('Regular font downloaded successfully!');

    console.log(`Downloading Bold font to ${boldDest}...`);
    await downloadFile(padaukBoldUrl, boldDest);
    console.log('Bold font downloaded successfully!');
  } catch (err) {
    console.error('Failed to download fonts:', err);
  }
}

run();
