const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function fixImportMeta(filePath) {
  if (fs.existsSync(filePath)) {
    let code = fs.readFileSync(filePath, 'utf8');
    code = code.replace(/import_meta\.url/g, `require('url').pathToFileURL(__filename).href`);
    code = code.replace(/import\.meta\.url/g, `require('url').pathToFileURL(__filename).href`);
    fs.writeFileSync(filePath, code, 'utf8');
  }
}

// 1. Patch @thallesp/nestjs-better-auth
try {
  const pkgDir = path.join(__dirname, '../node_modules/@thallesp/nestjs-better-auth');
  const mjsPath = path.join(pkgDir, 'dist/index.mjs');
  const cjsPath = path.join(pkgDir, 'dist/index.cjs');
  const pkgJsonPath = path.join(pkgDir, 'package.json');

  if (fs.existsSync(mjsPath)) {
    execSync(`npx -y esbuild "${mjsPath}" --outfile="${cjsPath}" --format=cjs --platform=node --bundle "--external:@nestjs/*" "--external:rxjs" "--external:@prisma/*" "--external:pg"`, {
      stdio: 'inherit',
    });

    fixImportMeta(cjsPath);

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

// 2. Patch better-auth (core & prisma adapter)
try {
  const baDir = path.join(__dirname, '../node_modules/better-auth');
  const baPkgJsonPath = path.join(baDir, 'package.json');

  if (fs.existsSync(baPkgJsonPath)) {
    const mainMjs = path.join(baDir, 'dist/index.mjs');
    const mainCjs = path.join(baDir, 'dist/index.cjs');
    if (fs.existsSync(mainMjs)) {
      execSync(`npx -y esbuild "${mainMjs}" --outfile="${mainCjs}" --format=cjs --platform=node --bundle "--external:@prisma/*" "--external:pg"`, {
        stdio: 'inherit',
      });
      fixImportMeta(mainCjs);
    }

    const prismaMjs = path.join(baDir, 'dist/adapters/prisma-adapter/index.mjs');
    const prismaCjs = path.join(baDir, 'dist/adapters/prisma-adapter/index.cjs');
    if (fs.existsSync(prismaMjs)) {
      execSync(`npx -y esbuild "${prismaMjs}" --outfile="${prismaCjs}" --format=cjs --platform=node --bundle "--external:@prisma/*" "--external:pg"`, {
        stdio: 'inherit',
      });
      fixImportMeta(prismaCjs);
    }

    const nodeMjs = path.join(baDir, 'dist/integrations/node.mjs');
    const nodeCjs = path.join(baDir, 'dist/integrations/node.cjs');
    if (fs.existsSync(nodeMjs)) {
      execSync(`npx -y esbuild "${nodeMjs}" --outfile="${nodeCjs}" --format=cjs --platform=node --bundle "--external:@prisma/*" "--external:pg"`, {
        stdio: 'inherit',
      });
      fixImportMeta(nodeCjs);
    }

    const pkg = JSON.parse(fs.readFileSync(baPkgJsonPath, 'utf8'));
    pkg.main = './dist/index.cjs';

    if (pkg.exports && pkg.exports['.']) {
      pkg.exports['.'].require = './dist/index.cjs';
      pkg.exports['.'].default = './dist/index.cjs';
    }
    if (pkg.exports && pkg.exports['./adapters/prisma']) {
      pkg.exports['./adapters/prisma'].require = './dist/adapters/prisma-adapter/index.cjs';
      pkg.exports['./adapters/prisma'].default = './dist/adapters/prisma-adapter/index.cjs';
    }
    if (pkg.exports && pkg.exports['./node']) {
      pkg.exports['./node'].require = './dist/integrations/node.cjs';
      pkg.exports['./node'].default = './dist/integrations/node.cjs';
    }

    fs.writeFileSync(baPkgJsonPath, JSON.stringify(pkg, null, 2));
    console.log('✅ Successfully patched better-auth for CommonJS compatibility.');
  }
} catch (err) {
  console.warn('Warning during better-auth patch:', err.message);
}
