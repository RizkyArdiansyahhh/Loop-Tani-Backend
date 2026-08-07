const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: './src/main.ts',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'main.js',
      libraryTarget: 'commonjs',
    },
    externals: [
      nodeExternals({
        allowlist: [
          /better-auth/,
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
