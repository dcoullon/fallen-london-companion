#!/usr/bin/env node
// Builds a Chrome-compatible zip by swapping in manifest.chrome.json.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const extDir   = path.join(__dirname, '..', 'extension');
const dist     = path.join(__dirname, '..', 'dist');
const mfMain   = path.join(extDir, 'manifest.json');
const mfChrome = path.join(extDir, 'manifest.chrome.json');
const mfBackup = path.join(extDir, 'manifest.json.bak');

fs.mkdirSync(dist, { recursive: true });

// Swap manifest
fs.copyFileSync(mfMain, mfBackup);
fs.copyFileSync(mfChrome, mfMain);

try {
  execSync(
    'web-ext build --source-dir extension/ --artifacts-dir dist/ --overwrite-dest --filename fallen_london_companion-chrome.zip',
    { stdio: 'inherit', cwd: path.join(__dirname, '..') }
  );
} finally {
  // Always restore the Firefox manifest
  fs.copyFileSync(mfBackup, mfMain);
  fs.unlinkSync(mfBackup);
}

console.log('Chrome zip built: dist/fallen_london_companion-chrome.zip');
