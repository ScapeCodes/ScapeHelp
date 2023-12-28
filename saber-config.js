const git = require("git-state");

let commit;

try {
    commit = git.commitSync(__dirname);
} catch (e) {
    commit = null;
    console.error("Could not determine current commit", e);
}

module.exports = {
    siteConfig: {
        title: "Craftation Labs",
        description: "Craftation Labs for development builds and official releases",
        link: [
          {
            rel: 'icon',
            type: 'image/x-icon',
            href:'https://craftationgaming.com/api/images/integration_favicon.ico'
          }
        ],
        lang: "en",
        commitHash: commit
    },
    themeConfig: {
        wikiSidebar: {
            "Getting Started": [
                { label: "Introduction", link: "/wiki" },
            ]
        }
    },
    theme: "./src",
    markdown: {
        plugins: [
            {
                resolve: "markdown-it-wikilinks",
                options: {
                    baseURL: "/wiki/",
                    makeAllLinksAbsolute: true
                }
            }
        ]
    }
}
