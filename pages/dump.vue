<template>
  <div>
    <div class="section">
      <div class="container">
      <b-notification type="is-primary" :closable="false">
        <p>
            Provide this Server Dump URL to CraftationGaming <a class="has-text-white" href="https://discord.gg/D5FnJ7C">support</a> to quickly receive help with your plugin issues.
        </p>
      </b-notification>
        <ClientOnly>
          <Dump />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script>
import Dump from "../components/Dump";

export const attributes = {
  title: "Server Dump"
};

export default {
  components: {
    Dump
  }
};
</script>