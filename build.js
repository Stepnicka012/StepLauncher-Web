import fs from "fs-extra";
import path from "path";
import fg from "fast-glob";
import { minify as minifyHTML } from "html-minifier-terser";
import { minify as minifyJS } from "terser";
import * as sass from "sass";
import { transform } from "esbuild";

const DIST = "dist";

await fs.remove(DIST);
await fs.ensureDir(DIST);

const MAIN_FOLDERS = ["Content", "Html", "Script", "Styles"];
const ROOT_FILES = ["index.html"];

for (const folder of MAIN_FOLDERS) {
    if (await fs.pathExists(folder)) {
        await fs.copy(folder, path.join(DIST, folder));
    }
}

for (const file of ROOT_FILES) {
    if (await fs.pathExists(file)) {
        await fs.copy(file, path.join(DIST, file));
    }
}

const htmlFiles = await fg([`${DIST}/**/*.html`]);

for (const file of htmlFiles) {
    try {
        const content = await fs.readFile(file, "utf-8");

        const minified = await minifyHTML(content, {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            minifyCSS: true,
            minifyJS: true
        });

        await fs.writeFile(file, minified);

    } catch (err) {
        console.error("Not Minify HTML:", file);
    }
}

const cssFiles = await fg([`${DIST}/Styles/**/*.css`]);

for (const file of cssFiles) {
    try {
        const compiled = sass.compile(file, {
            style: "expanded"
        });

        const minified = await transform(compiled.css, {
            loader: "css",
            minify: true
        });

        await fs.writeFile(file, minified.code);

    } catch (err) {
        console.error("Not Minify CSS:", file);
        console.error(err.message);
    }
}

const jsFiles = await fg([`${DIST}/Script/**/*.js`]);

for (const file of jsFiles) {
    try {
        const content = await fs.readFile(file, "utf-8");

        const result = await minifyJS(content, {
            compress: true,
            mangle: true
        });

        if (result.code) {
            await fs.writeFile(file, result.code);
        }

    } catch (err) {
        console.error("Not Minify JS:", file);
    }
}

console.log("🔥 Build terminado correctamente en /dist");