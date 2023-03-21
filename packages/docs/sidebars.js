// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '开始',
      items: [
        {
          type: 'doc',
          id: 'intro',
        },
        {
          type: 'doc',
          id: 'usage',
        },
        {
          type: 'doc',
          id: 'vsprompt',
        },
      ],
    },
  ],
};

module.exports = sidebars;
