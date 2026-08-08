const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  const pkgDir = path.join(__dirname, '../node_modules/@thallesp/nestjs-better-auth');
  const mjsPath = path.join(pkgDir, 'dist/index.mjs');
  const cjsPath = path.join(pkgDir, 'dist/index.cjs');
  const pkgJsonPath = path.join(pkgDir, 'package.json');

  if (fs.existsSync(mjsPath)) {
    execSync(`npx -y esbuild "${mjsPath}" --outfile="${cjsPath}" --format=cjs --platform=node --bundle "--external:@nestjs/*" "--external:rxjs" "--external:@prisma/*" "--external:pg"`, {
      stdio: 'inherit',
    });

    if (fs.existsSync(cjsPath)) {
      let code = fs.readFileSync(cjsPath, 'utf8');
      code = code.replace(/import_meta\.url/g, `require('url').pathToFileURL(__filename).href`);
      code = code.replace(/import\.meta\.url/g, `require('url').pathToFileURL(__filename).href`);
      fs.writeFileSync(cjsPath, code, 'utf8');
    }

    if (fs.existsSync(pkgJsonPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      pkg.main = './dist/index.cjs';
      pkg.exports = {
        '.': {
          types: './dist/index.d.ts',
          import: './dist/index.mjs',
          require: './dist/index.cjs',
          default: './dist/index.cjs',
        },
      };
      fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2));
      console.log('✅ Successfully patched @thallesp/nestjs-better-auth for CommonJS compatibility.');
    }
  }
} catch (err) {
  console.warn('Warning during @thallesp/nestjs-better-auth patch:', err.message);
}
