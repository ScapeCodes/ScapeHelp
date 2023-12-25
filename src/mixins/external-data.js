import Vue from "vue";
import axios from "axios";

const pluginsDefaults = {
    itemjoin: {
        name: "ItemJoin",
        description: "Get customs item on join",
        supportedVersions: "1.20.4, 1.19.4, 1.18.2, 1.17.1, 1.16.5, 1.15.2, 1.15.2, 1.14.4, 1.13.2",
        deprecatedVersions: "1.8.8, 1.9.4, 1.10.2, 1.11.2, 1.12.2",
        releaseVersions: "1.20.2, 1.19.4, 1.18.2, 1.17.1, 1.16.5, 1.15.2, 1.15.2, 1.14.4, 1.13.2",
        downloadUrl: null,
        gitAPIUrl: "https://api.github.com/repos/RockinChaos/ItemJoin",
        premiumUrl: null,
        changelogDevUrl: "https://github.com/RockinChaos/ItemJoin/commits/master",
        changelogReleaseUrl: "https://github.com/RockinChaos/ItemJoin/releases",
        spigetUrl: "https://api.spiget.org/v2/resources/12661",
        commit: null,
        build: null,
        version: null,
        premium: false,
        tags: [{ text: 'PLUGIN', color: 'info' }, { text: 'MINECRAFT', color: 'light' }]
    },
    fakecreative: {
        name: "FakeCreative",
        description: "A creative mode emulation",
        supportedVersions: "1.20.4, 1.19.4, 1.18.2, 1.17.1, 1.16.5, 1.15.2, 1.15.2, 1.14.4, 1.13.2",
        deprecatedVersions: "1.8.8, 1.9.4, 1.10.2, 1.11.2, 1.12.2",
        releaseVersions: "1.18.2, 1.17.1, 1.16.5, 1.15.2, 1.15.2, 1.14.4, 1.13.2",
        downloadUrl: null,
        gitAPIUrl: "https://api.github.com/repos/RockinChaos/FakeCreative",
        premiumUrl: "https://www.spigotmc.org/resources/fakecreative.95959/",
        changelogDevUrl: "https://github.com/RockinChaos/FakeCreative/commits/master",
        changelogReleaseUrl: "https://www.spigotmc.org/resources/fakecreative.95959/updates",
        spigetUrl: "https://api.spiget.org/v2/resources/95959",
        commit: null,
        build: null,
        version: null,
        premium: true,
        tags: [{ text: 'PLUGIN', color: 'info' }, { text: 'PREMIUM', color: 'danger' }, { text: 'MINECRAFT', color: 'light' }]
    },
    chaoscore: {
        name: "ChaosCore",
        description: "A shaded core utility",
        supportedVersions: "1.20.4, 1.19.4, 1.18.2, 1.17.1, 1.16.5, 1.15.2, 1.15.2, 1.14.4, 1.13.2",
        deprecatedVersions: "1.8.8, 1.9.4, 1.10.2, 1.11.2, 1.12.2",
        releaseVersions: "1.20.2, 1.19.4, 1.18.2, 1.17.1, 1.16.5, 1.15.2, 1.15.2, 1.14.4, 1.13.2",
        downloadUrl: null,
        gitAPIUrl: "https://api.github.com/repos/RockinChaos/ChaosCore",
        premiumUrl: null,
        changelogDevUrl: "https://github.com/RockinChaos/ChaosCore/commits/master",
        changelogReleaseUrl: "https://github.com/RockinChaos/ChaosCore/releases",
        spigetUrl: null,
        commit: null,
        build: null,
        version: null,
        premium: false,
        tags: [{ text: 'LIBRARY', color: 'warning' }, { text: 'MINECRAFT', color: 'light' }]
    }
};

const state = Vue.observable({
    github: {
        stars: null,
        forks: null,
    },
    discord: {
        members: null,
    },
    static: {
        year: new Date().getFullYear(),
    },
    builds: {
        dev: {
            plugins: {
                itemjoin: { ...pluginsDefaults.itemjoin },
                fakecreative: { ...pluginsDefaults.fakecreative },
                chaoscore: { ...pluginsDefaults.chaoscore }
            },
            loading: true,
            error: null
        },
        stable: {
            plugins: {
                itemjoin: { ...pluginsDefaults.itemjoin },
                fakecreative: { ...pluginsDefaults.fakecreative },
                chaoscore: { ...pluginsDefaults.chaoscore }
            },
            loading: true,
            error: null
        }
    },
    downloads: 200000
});

export default {
    data() {
        return {
            external: state
        }
    },
    methods: {
        refreshDownloads() {
            getJenkins();
            getLatestRelease();
        }
    }
}

async function getDownloads() {
    let response;
    let count = 0;
    for (const name in pluginsDefaults) {
        const url = state.builds.dev.plugins[name].spigetUrl;
        if (url != null) {
            try {
                response = await axios.get(url);
                count += response.data.downloads * 2; // (* 2 temporary) for Bukkit/CurseForge download count.
            } catch (e) {
                count += state.downloads;
            }
        }
    }
    state.downloads = count;
}

async function getProjects() {
    let count = 0;

    for (const name in pluginsDefaults) {
        count++;
    }

    state.projects = count;
}

async function getMembers() {
    let members = 0;
    try {
        let response = await axios.get("https://canary.discord.com/api/guilds/291764091239006208/widget.json");
        members = response.data.presence_count;
    } catch (e) { }

    state.discord.members = members;
}

async function getStars() {
    let stars = 0;
    let forks = 0;

    for (const name in pluginsDefaults) {
        try {
            let response = await axios.get(state.builds.stable.plugins[name].gitAPIUrl);
            stars += response.data.stargazers_count;
            forks += response.data.forks_count;
        } catch (e) { }
    }

    state.github.stars = stars;
    state.github.forks = forks;
}

const mainCI = "https://jenkins.craftationgaming.com/job/job_id/";
const versionRegex = "job_id[a-zA-Z]*-([0-9.]+?(?:-(?:SNAPSHOT|BETA|ALPHA|EXPERIMENTAL)-[a-zA-Z][0-9]+)?(?:-([0-9a-fA-F]+?))?).jar";

function getVersionFromArtifact(name, fileName) {
    let m;
    while ((m = new RegExp(versionRegex.replace("job_id", name)).exec(fileName)) !== null) {
        return m[1];
    }
}

function getCommitIdFromArtifact(name, fileName) {
    let m;
    while ((m = new RegExp(versionRegex.replace("job_id", name)).exec(fileName)) !== null) {
        return m[2];
    }
}

async function getJenkins() {
    try {
        state.builds.dev.loading = true;
        for (const name in pluginsDefaults) {
            let currentCI = mainCI.replace("job_id", name);
            let response = await axios.get(`${currentCI}lastSuccessfulBuild/api/json`);
            state.builds.dev.plugins[name].build = response.data.id;
            state.builds.dev.plugins[name].version = getVersionFromArtifact(state.builds.dev.plugins[name].name, response.data.artifacts[0].displayPath);
            if (response.data.changeSet.items[0]) {
                state.builds.dev.plugins[name].commit = response.data.changeSet.items[0].commitId;
            } else {
                state.builds.dev.plugins[name].commit = getCommitIdFromArtifact(state.builds.dev.plugins[name].name, response.data.artifacts[0].displayPath);
            }
            if (!state.builds.dev.plugins[name].commit) {
                state.builds.dev.plugins[name].commit = null;
            }
            state.builds.dev.error = null;
            response.data.artifacts.forEach(artifact => {
                state.builds.dev.plugins[name].downloadUrl = `${currentCI}lastSuccessfulBuild/artifact/${artifact.relativePath}`;
            });
        }
    } catch (e) {
        state.builds.dev.error = e.response ? e.response.data : e.message;
    }
    state.builds.dev.loading = false;
}

async function getLatestRelease() {
    try {
        state.builds.stable.loading = true;
        for (const name in pluginsDefaults) {
            const { data } = await axios.get('https://api.github.com/repos/RockinChaos/' + name + '/releases');
            state.builds.stable.plugins[name].version = data[0].tag_name + "-RELEASE";
            state.builds.stable.error = null;
            data[0].assets.forEach(asset => {
                state.builds.stable.plugins[name].downloadUrl = asset.browser_download_url;
            });
        }
    } catch (e) {
        state.builds.stable.error = e.response ? e.response.data : e.message;
    }
    state.builds.stable.loading = false;
}

getJenkins();
getLatestRelease();
getMembers();
getStars();
getDownloads();
getProjects();
