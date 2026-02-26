const fs = require('fs');
const path = require('path');

function checkFileCase(filePath) {
    const dir = path.dirname(filePath);
    const base = path.basename(filePath);

    if (!fs.existsSync(dir)) return false;

    const files = fs.readdirSync(dir);
    for (const f of files) {
        if (f.toLowerCase() === base.toLowerCase() && f !== base) {
            return f; // Returns the ACTUAL case on disk
        }
    }
    return null;
}

const apiPath = path.join(__dirname, 'src', 'app', 'api', 'admin');
console.log('Checking API Admin Directory:', apiPath);
if (fs.existsSync(apiPath)) {
    console.log('API Admin folder exists. Actual files/folders inside:');
    console.log(fs.readdirSync(apiPath));
} else {
    console.log('API Admin folder DOES NOT EXIST at', apiPath);
}

const modelsPath = path.join(__dirname, 'src', 'models');
console.log('\nChecking Models Directory:', modelsPath);
if (fs.existsSync(modelsPath)) {
    console.log('Models folder exists. Actual files/folders inside:');
    console.log(fs.readdirSync(modelsPath));
} else {
    console.log('Models folder DOES NOT EXIST at', modelsPath);
}
