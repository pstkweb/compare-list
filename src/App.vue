<template>
  <div id="app" @paste="onPaste">
    <AppHeader />
    <div id="main">
      <router-view/>
    </div>
    <footer>
      <p>Made with ♥ by <a href="http://pastekweb.fr" rel="nofollow">Pastekweb</a></p>
    </footer>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import AppHeader from './components/AppHeader';

  export default {
    name: 'app',
    components: {
      AppHeader,
    },
    methods: {
      ...mapActions(['add']),
      onPaste(evt) {
        for (let i = 0; i < evt.clipboardData.items.length; i += 1) {
          const item = evt.clipboardData.items[i];
          if (item.type === 'text/plain') {
            item.getAsString((s) => {
              if (s.length > 0) {
                try {
                  s.split(/\n/).forEach((uri) => {
                    this.add(uri);
                  });
                } catch (e) {
                  // TODO show alert
                }
              }
            });
          }
        }
      },
    },
  };
</script>

<style lang="scss">
  @import '~mini.css/src/flavors/mini-default.scss';

  html, body {
    padding: 0;
    margin: 0;
    height: 100%;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 100%;

    #main {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }

    footer {
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;

      p {
        margin: 0;
        padding: 0;
      }
    }
  }
</style>
