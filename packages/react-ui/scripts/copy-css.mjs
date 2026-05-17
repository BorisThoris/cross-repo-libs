import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(packageRoot, 'src', 'react-ui.css');
const target = path.join(packageRoot, 'dist', 'react-ui.css');

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.copyFileSync(source, target);
