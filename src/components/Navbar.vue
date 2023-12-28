<template>
    <nav class="navbar is-dark is-spaced" role="navigation" aria-label="main navigation">
        <div class="container">
            <div class="navbar-brand">
                <SaberLink class="navbar-logo is-marginless has-text-large" style="width:400px" to="/">
                    <!-- <b>{{ $siteConfig.title }}</b> -->
                    <img src="@/images/logo-navbar.png">
                </SaberLink>

                <a role="button" :class="burgerClass" @click="expanded = !expanded" aria-label="menu" aria-expanded="false" data-target="navbar-main">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbar-main" :class="mainClass">
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
    data() {
        return {
            expanded: false,
        };
    },
    computed: {
        burgerClass() {
            return {
                "navbar-burger": true,
                "burger": true,
                "is-active": this.expanded
            };
        },
        mainClass() {
            return {
                "navbar-menu": true,
                "is-active": this.expanded
            };
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
