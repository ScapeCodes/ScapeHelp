<template>
  <div>
    <b-message type="is-primary" v-if="invalid">
      <div class="content">
        <p>
          Run the <b>/plugin-name dump</b> in-game or from the console to generate a server dump.
          <br/>
          You can then click on the provided link to view the dump, or you can give the link to <a class="has-text-white" href="https://discord.gg/D5FnJ7C" target="_blank" rel="noopener noreferrer">CraftationGaming</a> support when getting help.
        </p>
        <p>
          Be sure to replace "plugin-name" with the plugin you are using.
          <br/>
          Command not working? <saber-link to="/downloads.html">Update</saber-link> to the latest version and try again.
        </p>
      </div>
    </b-message>

    <b-message type="is-danger" v-if="error">
      <div class="content">
        <p>
          Failed to load the dump data!
          <br/> <br/>
          Double check you used the correct URL, and if that doesn't work, try generating a new dump with <b>/plugin-name dump</b>.
          <br/>
          Be sure to replace "plugin-name" with the plugin you are using.
        </p>
        <details v-if="friendlyError != error">
          <summary>
            Error: <b>{{ friendlyError }}</b>
          </summary>
          <highlightjs language="yaml" :code="JSON.stringify(error, null, 4)" />
        </details>
        <p v-else>
          Error: <b>{{ error }}</b>
        </p>
      </div>
    </b-message>

    <b-skeleton height="120px" :count="5" :active="isLoading" />

    <div v-if="loaded">
      <div class="message is-primary">
        <div class="message-header">
          <p>Plugin information</p>
        </div>
        <div class="message-body">
          <nav class="level">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Resource Name</p>
                <p class="title is-6">{{ resourceName }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Version</p>
                <p class="title is-6">{{ pluginVersion }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">In Development</p>
                <p class="title is-6">{{ pluginDev }}</p>
              </div>
            </div>
          </nav>
        </div>
      </div>
      
      <div class="message is-serverinfo">
        <div class="message-header">
          <p>Server information</p>
        </div>
        <div class="message-body">
          <nav class="level">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Brand</p>
                <p class="title is-6">{{ srvBrand }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Server Version</p>
                <p class="title is-6">{{ srvVersion }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Bukkit Version</p>
                <p class="title is-6">{{ srvBukkitVersion }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Online Mode</p>
                <p class="title is-6">{{ srvOnlineMode }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Support Status</p>
                <p class="title is-6">{{ srvSupport }}</p>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <div class="message is-info">
        <div class="message-header">
          <p>Server environment</p>
        </div>
        <div class="message-body">
          <nav class="level">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Java Version</p>
                <p class="title is-6">{{ envJava }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">OS Name</p>
                <p class="title is-6">{{ envOs }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Uptime</p>
                <p class="title is-6">{{ envUptime }}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Allocated Memory</p>
                <p class="title is-6">{{ envMemory }}</p>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <collapse-message type="is-dark">
        <template v-slot:title>
          Server plugins ({{ plugins.length }})
        </template>

        <DumpPlugins :entries="plugins" searchable />
      </collapse-message>

      <collapse-message type="is-black" v-if="latest">
        <template v-slot:title>
          Server log
        </template>

        <code class="p-0">
          <pre class="dump-log">{{ latest }}</pre>
        </code>
      </collapse-message>

      <collapse-message type="is-black" v-if="config">
        <template v-slot:title>
          Config.yml
        </template>

        <highlightjs class="p-0" language="yaml" :code="config" />
      </collapse-message>

      <collapse-message type="is-black" v-if="lang">
        <template v-slot:title>
          Lang.yml
        </template>

        <highlightjs class="p-0" language="yaml" :code="lang" />
      </collapse-message>

      <collapse-message type="is-black" v-if="items">
        <template v-slot:title>
          Items.yml
        </template>

        <highlightjs class="p-0" language="yaml" :code="items" />
      </collapse-message>

      <b-notification type="is-dark" :closable="false">
        <p>
          Generated by
          <span v-if="senderUuid"> <img :src="senderImg" /></span>
          <b>{{ senderName }}</b>
          at {{ new Date(timestamp).toLocaleString() }} using <a :href="originalUrl" target="_blank" rel="noopener noreferrer">Craftation Paste</a>.
        </p>
      </b-notification>
    </div>
  </div>
</template>
<script>
import CollapseMessage from "./CollapseMessage"
import DumpPlugins from "./DumpPlugins";
import axios from "axios";

export default {
  components: {
    CollapseMessage,
    DumpPlugins
  },
  mounted() {
    this.loadData()
  },
  data() {
    return {
      loaded: false,
      error: null,
      invalid: false,
      isErrorPopupOpen: false,

      pluginVersion: null,
      resourceName: null,
      pluginDev: null,

      srvBrand: null,
      srvVersion: null,
      srvBukkitVersion: null,
      srvSupport: null,
      srvOnlineMode: null,

      envJava: null,
      envOs: null,
      envUptime: null,
      envMemory: null,

      config: null,
      lang: null,
      items: null,
      latest: null,

      plugins: [],

      timestamp: 0,
      sender: "",
      senderUuid: "",
    }
  },
  methods: {
    async loadData() {
      if (!this.pasteId) {
        this.invalid = true
        return;
      }

      try {
        const { data } = await axios.get(`https://paste.craftationgaming.com/raw/${this.pasteId}`)

            const dump = data
            this.resourceName = dump["plugin-data"].name
            this.pluginVersion = dump["plugin-data"].version
            this.pluginDev = (dump["plugin-data"].dev ? "YES" : "NO")

            this.srvBrand = dump["server-data"]["server-brand"]
            this.srvVersion = dump["server-data"]["server-version"]
            this.srvBukkitVersion = dump["server-data"]["bukkit-version"]
            this.srvOnlineMode = dump["server-data"].hasOwnProperty("online-mode") ? dump["server-data"]["online-mode"] : "Not Provided"
            this.srvSupport = (dump["server-data"]["support-status"].supported ? "Up to Date" : "OUTDATED")

            this.envJava = dump.environment["java-version"]
            this.envOs = dump.environment["operating-system"]
            this.envUptime = dump.environment.uptime
            this.envMemory = dump.environment["allocated-memory"]

            this.config = dump.files.["config.yml"]
            this.lang = dump.files.["lang.yml"]
            this.items = dump.files.["items.yml"]
            this.latest = dump.files.["latest.log"]

            this.plugins = dump.plugins

            this.timestamp = dump.meta.timestamp
            this.sender = dump.meta.sender
            this.senderUuid = dump.meta.senderUuid
        this.loaded = true
      } catch (e) {
        this.error = e.response ? e.response.data : e.message
      }
    }
  },
  computed: {
    pasteId() {
      return this.$route.hash ? this.$route.hash.substring(1) : this.$route.query.id;
    },
    friendlyError() {
      if (typeof this.error == "string") {
        return this.error;
      }
      
      if (this.error.error) {
        switch (this.error.error) {
          case "not_found":
            return "Invalid paste ID";
          case "missing_paste":
            return "Paste not found";
        }
      }

      return "Unknown error"
    },
    isLoading() {
      return !this.loaded && !this.error && !this.invalid;
    },
    originalUrl() {
      return `https://paste.craftationgaming.com/${this.pasteId}`;
    },
    senderName() {
      return this.sender || "CONSOLE";
    },
    senderImg() {
      return `https://crafthead.net/helm/${this.senderUuid}/16`;
    },
  }
}
</script>

<style>
pre {
  overflow-x: auto;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
.dump-log {
  padding: 0.5em;
  font-size: 1em;
  background-color: #1c1b1b;
}
</style>