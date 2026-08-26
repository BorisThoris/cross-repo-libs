const entryUrl = new URL('../dist/index.js', import.meta.url);
const reactUi = await import(entryUrl.href);

if (!Object.hasOwn(reactUi, 'ReadingProgress')) {
  throw new Error('Built React UI root is missing the ReadingProgress export.');
}

console.log('Node import check passed: @cross-repo-libs/react-ui');
