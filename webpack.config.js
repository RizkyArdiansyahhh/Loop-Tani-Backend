const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: './src/serverless.ts',
    output: {
      path: path.join(__dirname, 'api'),
      filename: 'index.js',
      libraryTarget: 'commonjs',
    },
    externals: [
      nodeExternals({
        // Bundle all ESM dependencies into api/index.js EXCEPT Prisma Client and pg
        allowlist: [
          /^(?!@prisma\/client|@prisma\/adapter-pg|pg).*/,
        ],
      }),
    ],
    plugins: [
      ...(options.plugins || []),
      new webpack.IgnorePlugin({
        checkResource(resource) {
          const optionalImports = [
            '@nestjs/graphql',
            '@nestjs/websockets',
            '@apollo/server',
            'fastify',
            '@opentelemetry/api',
          ];
          if (!optionalImports.includes(resource)) {
            return false;
          }
          try {
            require.resolve(resource, { paths: [process.cwd()] });
            return false;
          } catch (err) {
            return true;
          }
        },
      }),
    ],
  };
};
