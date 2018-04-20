declare var __webpack_public_path__: any;

const root = document.getElementById('root');
const config = JSON.parse(root!.getAttribute('config')!);
__webpack_public_path__ = config.assetPath;
