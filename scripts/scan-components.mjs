import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inventoryPath = path.join(repoRoot, 'component-inventory.json');
const reposRoot = path.resolve(repoRoot, '..');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

const rows = inventory.map((item) => {
  const paths = item.sourcePaths.map((sourcePath) => ({
    path: sourcePath,
    exists: fs.existsSync(path.join(reposRoot, sourcePath))
  }));

  return {
    name: item.name,
    status: item.status,
    package: item.package || '-',
    sourceRepo: item.sourceRepo,
    sourcePathsPresent: `${paths.filter((sourcePath) => sourcePath.exists).length}/${paths.length}`
  };
});

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  printTable(rows);
}

function printTable(items) {
  const columns = [
    ['status', 'status'],
    ['component', 'name'],
    ['package', 'package'],
    ['repo', 'sourceRepo'],
    ['paths', 'sourcePathsPresent']
  ];
  const widths = Object.fromEntries(
    columns.map(([label, key]) => [label, Math.max(label.length, ...items.map((item) => String(item[key]).length))])
  );

  console.log(columns.map(([label]) => label.padEnd(widths[label])).join('  '));
  console.log(columns.map(([label]) => '-'.repeat(widths[label])).join('  '));
  for (const item of items) {
    console.log(columns.map(([label, key]) => String(item[key]).padEnd(widths[label])).join('  '));
  }
}
