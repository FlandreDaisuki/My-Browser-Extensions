import metablock from 'rollup-plugin-userscript-metablock';

export default [{
  input: './index.js',
  plugins: [
    metablock({
      order: [
        'name',
        'description',
        'namespace',
        'version',
        '...',
        'grant',
        'noframes',
        'author',
        'supportURL',
        'homepageURL',
        'license',
      ],
    }),
  ],

  output: {
    file: '../GitHubPullRequestBranchReveal.user.js',
    format: 'iife',
  },
}];
