<template>
    <div>
        <footer class="footer has-background-black-ter has-text-white">
            <div class="container">
                <div class="field is-grouped is-grouped-multiline has-text-weight-semibold">
                    <b-tooltip class="control" multilined label="Visit the build server">
                        <div class="tags has-addons">
                            <a href="https://ci-dev.craftationgaming.com/" target="_blank" rel="noopener noreferrer" class="tag is-dark">Jenkins</a>
                            <a href="https://ci-dev.craftationgaming.com/" target="_blank" rel="noopener noreferrer" class="tag is-success">{{ projects }} projects</a>
                        </div>
                    </b-tooltip>
                    <b-tooltip class="control" multilined :label="downloadsHover + ' downloads across BukkitDev and SpigotMC'">
                        <div class="tags has-addons">
                            <a href="https://www.spigotmc.org/members/rockinchaos.3051/#resources" target="_blank" rel="noopener noreferrer" class="tag is-dark">Downloads</a>
                            <a href="https://www.spigotmc.org/members/rockinchaos.3051/#resources" target="_blank" rel="noopener noreferrer" class="tag is-spigot">{{ downloads }} downloads</a>
                        </div>
                    </b-tooltip>
                    <b-tooltip class="control" multilined :label="membersHover + ' people chatting on Discord'">
                        <div class="tags has-addons">
                            <a href="https://discord.gg/D5FnJ7C" target="_blank" rel="noopener noreferrer" class="tag is-dark">Discord</a>
                            <a href="https://discord.gg/D5FnJ7C" target="_blank" rel="noopener noreferrer" class="tag is-discord">{{ members }} online</a>
                        </div>
                    </b-tooltip>
                    <b-tooltip class="control" multilined label="Visit us on GitHub">
                        <div class="tags has-addons">
                            <a href="https://github.com/RockinChaos/" target="_blank" rel="noopener noreferrer" class="tag is-dark">GitHub</a>
                            <a href="https://github.com/RockinChaos/" target="_blank" rel="noopener noreferrer" class="tag is-black">{{ stars }} stars</a>
                        </div>
                    </b-tooltip>
                    <b-tooltip v-if="commitHash" class="control" multilined label="View the website source code">
                        <div class="tags has-addons">
                            <a :href="commitLink" target="_blank" rel="noopener noreferrer" class="tag is-dark">Website</a>
                            <a :href="commitLink" target="_blank" rel="noopener noreferrer" class="tag is-white-bis">{{ commitHash }}</a>
                        </div>
                    </b-tooltip>
                    <b-tooltip class="control" multilined label="Change the website theme">
                        <theme-toggle></theme-toggle>
                    </b-tooltip>
                </div>
            </div>
            <br />
            <div class="container content">
                <p>&copy; {{ copyYear }} CraftationGaming</p>
            </div>
        </footer>
    </div>

</template>

<script>
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

export default {
    props: ["page"],
    computed: {
        commitHash() {
            return this.$siteConfig.commitHash;
        },
        commitLink() {
            return "https://github.com/RockinChaos/Craftation-Labs/commit/" + this.commitHash;
        },
        projects() {
            return this.external.projects;
        },
        downloads() {
            return this.external.downloads ? (this.external.downloads / 1000).toFixed(0) + "k" : "200k";
        },
        downloadsHover() {
            return this.external.downloads ? this.external.downloads.toLocaleString("en") : "Over 200,000";
        },
        stars() {
            return this.external.github.stars || "400+";
        },
        buildNo() {
            return this.external.builds.dev.build || "???";
        },
        members() {
            return this.external.discord.members ? this.external.discord.members : "500";
        },
        copyYear() {
            return "2013 - " + this.external.static.year;
        },
        membersHover() {
            return this.external.discord.members || "Over 500";
        },
        latestRelease() {
            return this.external.builds.stable.version;
        }
    },
    components: {
        ThemeToggle
    }
}



</script>


<style>
.hide-until-code {
    display: none;
}

.konami .hide-until-code {
    display: initial;
}
</style>
