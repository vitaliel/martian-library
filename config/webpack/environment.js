const { environment } = require('@rails/webpacker')

environment.loaders.append('grapthql', {
  test: /\.(graphql|gql)/,
  exclude: /node_modules/,
  loader: 'graphql-tag/loader'
});

module.exports = environment
