<template>
  <nav class="navbar is-dark is-spaced" role="navigation" aria-label="main navigation">
    <div class="container">
      <div class="navbar-brand">
        <SaberLink class="navbar-logo is-marginless has-text-large" style="width:400px" to="/">
          <img src="@/images/logo-navbar.png">
        </SaberLink>
      </div>

      <div id="navbar-main">
        <div class="navbar-end has-text-centered-touch">
          <SaberLink to="/community" class="navbar-item">Community</SaberLink>
          <a class="navbar-item" href="https://repo.craftationgaming.com/" target="_blank" rel="noopener noreferrer">Repository</a>
          <a class="navbar-item" href="https://paste.craftationgaming.com/" target="_blank" rel="noopener noreferrer">Paste</a>
          <SaberLink to="/wiki" class="navbar-item">Wiki</SaberLink>
          <SaberLink to="/downloads" class="navbar-item">
            <button :class="buttonClass('is-white')">Downloads</button>
          </SaberLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    hero: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    buttonClass(colour) {
      return {
        button: true,
        "is-rounded": true,
        [colour]: true,
      }
    }
  }
}
</script>

<style>
  .navbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }

  #navbar-main {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    flex: 1;
  }

  .navbar-end {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  .navbar-brand {
    flex-shrink: 0;
  }

  .navbar-item {
    white-space: nowrap;
  }

  @media (max-width: 1023px) {
    .navbar {
      justify-content: center;
    }

    #navbar-main {
      justify-content: center;
      text-align: center;
    }

    .navbar-end {
      justify-content: center;
      flex-basis: 100%;
    }

    .navbar-brand {
      display: flex;
      justify-content: center;
      width: 100%;
    }
  }
</style>