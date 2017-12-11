<template>
  <p v-if="loading" class="section double-padded loading">Please wait while loading your list.</p>
  <section id="items-container" v-else>
    <Product v-for="uri in uris" v-bind:url="uri" :key="uri.url" />
  </section>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import Product from './Product';
  import HTTP from '../api';

  export default {
    name: 'List',
    computed: {
      ...mapGetters(['uris', 'list']),
    },
    data() {
      return {
        loading: true,
        error: null,
      };
    },
    methods: {
      ...mapMutations(['add', 'create', 'clear']),
    },
    components: {
      Product,
    },
    created() {
      this.clear();
      this.create(this.$route.params.id);

      HTTP.get(`list/${this.$route.params.id}`)
        .then((response) => {
          this.loading = false;

          response.data.forEach((uri) => { this.add(uri); });
        })
        .catch((e) => {
          this.loading = false;
          this.error = `Unable to load your products : ${e}.`;
        });
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
</style>
