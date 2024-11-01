import {execSync} from "child_process";

execSync('npx vue-tsc --noEmit && vite build && esbuild dist/lsBaseLib.es.js --minify --format=esm --allow-overwrite --outfile=dist/lsBaseLib.es.js');
