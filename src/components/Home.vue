<template>
  <vue-dropzone v-if="uris.length === 0" ref="dropzone" id="dropzone" :options="dropzoneOpts"></vue-dropzone>
  <section id="items-container" v-else>
    <Product v-for="uri in uris" v-bind:url="uri" :key="uri.url" />
  </section>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import vue2Dropzone from 'vue2-dropzone';
  import 'dropzone/dist/dropzone.css';
  import Product from './Product';

  export default {
    name: 'Home',
    computed: {
      ...mapGetters(['uris', 'list']),
    },
    watch: {
      list() {
        return this.$router.push(`/${this.list}`);
      },
    },
    data() {
      const self = this;

      return {
        dropzoneOpts: {
          url: '#',
          dictDefaultMessage:
            'Drop or click to add a file (one link per line), paste text (one link per line) or use form in top bar to add a product.',
          acceptedFiles: 'text/*',
          accept: (file) => {
            const reader = new FileReader();
            reader.addEventListener('loadend', (evt) => {
              if (evt.target.result.length > 0) {
                try {
                  evt.target.result.split(/\n/).forEach((uri) => {
                    self.add(uri);
                  });
                } catch (e) {
                  // TODO show alert
                }
              }
            });
            reader.readAsText(file);
          },
        },
      };
    },
    methods: {
      ...mapActions(['add']),
    },
    components: {
      Product,
      vueDropzone: vue2Dropzone,
    },
  };
</script>

<style scoped lang="scss">
  #items-container {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    width: 100%;
  }

  #dropzone {
    width: 50%;
    height: 150px;
  }
</style>
