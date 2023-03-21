// @ts-check

const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'sweet-i18n',
  tagline: 'Make i18n translation easy!!!',
  url: 'https://sweet.icodex.me/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'wood3n',
  projectName: 'sweet-i18n',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // 开启 algolia
      // algolia: {
      //   // If Algolia did not provide you any appId, use 'BH4D9OD16A'
      //   appId: "sdss",

      //   // Public API key: it is safe to commit it
      //   apiKey: "dsdaasdad",

      //   indexName: "sweet-i18n",
      // },
      colorMode: {
        defaultMode: 'dark',
      },
      navbar: {
        title: 'sweet-i18n',
        logo: {
          alt: 'sweet-i18n',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'search',
            position: 'right',
          },
          {
            type: 'doc',
            docId: 'intro',
            position: 'right',
            label: '文档',
          },
          {
            to: 'blog',
            label: '更新日志',
            position: 'right',
          },
          {
            href: 'https://github.com/wood3n/sweet-i18n',
            position: 'right',
            // custom logo in custom.css
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      prism: {
        theme: darkCodeTheme,
        darkTheme: darkCodeTheme,
        defaultLanguage: 'javascript',
      },
      footer: {
        style: 'light',
        copyright: `Copyright © ${new Date().getFullYear()} sweet-i18n. Built with Docusaurus.`,
      },
    }),
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
  },
};

module.exports = config;
