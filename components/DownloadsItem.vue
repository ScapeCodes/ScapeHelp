<template>
  <div class="content">
    <div class="content">
      <p v-if="version"> The latest <b>{{ branch }}</b> version of {{ name }} is <b>{{ version }}</b>
        <span v-if="build"> (build {{ build }} <span v-if="commit">, commit <a :href='`https://github.com/RockinChaos/${name}/commit/${commit}`'>{{ commit.substring(0, 7) }}</a>, <a :href="changelogDevUrl">changelog</a>).</span></span>
        <span v-if="branch == 'stable'"> (<a :href="changelogReleaseUrl">changelog</a>).</span>
      </p>
    </div>
    <div class="box">
      <div class="columns">
        <div class="column is-narrow">
          <u>
            <p class="title is-4 no-margin-bottom">{{ name }}</p>
          </u>
          <p>{{ version }}</p>
        </div>
        <div class="column">
          <div class="tags column-margin-top">
            <span v-for="tag in tags" :key="tag.name" :class="tagClass(tag)">
              <b>{{ tag.text }}</b>
            </span>
          </div>
        </div>
        <div class="column is-narrow is-hidden-tablet">
          <p class="content">
            {{ description }}
          </p>
        </div>
        <div class="column is-narrow">
          <div class="buttons column-margin-top">
            <b-button type="is-info" v-if="info" tag="a" :href="info"> More Info </b-button>
            <b-button type="is-button-primary" v-if="downloadUrl" tag="a" :href="downloadUrl"> Download </b-button>
            <b-button type="is-button-secondary" v-if="premium && branch == 'stable'" tag="a" :href="premiumUrl"> Download </b-button>
          </div>
        </div>
      </div>
      <div class="is-hidden-mobile">
        <div class="content download-bottom">
          <div class="message-body">
            <p>
              {{ description }}
            </p>
            <p> Officially supports <b>CraftBukkit</b>, <b>Spigot</b> and <a href="https://papermc.io/">
                <b>Paper (recommended)</b>
              </a> server software. </p>
            <ul>
              <li>✅ <b v-if="branch == 'stable'">{{ releaseVersions }}</b> <b v-if="branch == 'dev'">{{ supportedVersions }}</b> - Actively developed against and supports these versions. </li>
              <li>⚠️ <b>{{ deprecatedVersions }}</b> - These versions are still supported, but are not a priority for us, and may be dropped in a future release. </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        releaseVersions: {
            type: String,
            required: true
        },
        supportedVersions: {
            type: String,
            required: true
        },
        deprecatedVersions: {
            type: String,
            required: true
        },
        version: {
            type: String,
            required: true
        },
        branch: {
            type: String,
            required: true
        },
        downloadUrl: {
            type: String,
            required: false
        },
        premiumUrl: {
            type: String,
            required: false
        },
        commit: {
            type: String,
            required: false
        },
        build: {
            type: String,
            required: false
        },
        changelogDevUrl: {
            type: String,
            required: false
        },
        changelogReleaseUrl: {
            type: String,
            required: false
        },
        premium: {
            type: Boolean,
            required: false
        },
        info: {
            type: String,
            required: false
        },
        tags: {
            type: Array,
            required: false
        }
    },
    methods: {
        tagClass(tag) {
            let tagColor = tag.color || "primary";
            return {
                tag: true,
                [`is-${tagColor}`]: true
            };
        }
    }
}
</script>

<style scoped>
.no-margin-bottom {
    margin-bottom: 0;
}

.column-margin-top {
    margin-top: 0.2rem
}
</style>