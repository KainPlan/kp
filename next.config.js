const { nextI18NextRewrites } = require('next-i18next/rewrites');
const withPlugins = require('next-compose-plugins');
const optimizedImages = require('next-optimized-images');

const localeSubpaths = {
  de: 'de',
  en: 'en',
};

module.exports = withPlugins([
  [optimizedImages, {
    optimizeImagesInDev: false,
  },],
], {
  rewrites: async () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    localeSubpaths,
  },
});