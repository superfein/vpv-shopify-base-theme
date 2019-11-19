import './components/compile';

import {
  makeDir, compile, deploy,
} from './components/theme-commands';

makeDir();

(async () => {
  await compile();
  deploy();
})();
