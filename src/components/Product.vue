<template>
  <section class="card">
    <p v-if="loading" class="section double-padded loading">
      Please wait while loading data from your <a :href="url.url">url</a>.
    </p>
    <p v-else-if="error" class="error">{{this.error}}</p>
    <template v-else>
      <img class="section media" :src="img" :alt="name">
      <h3 class="section double-padded">{{ this.name }}</h3>
      <span class="price section dark double-padded">{{ this.price }}€</span>
      <a :href="url.url" class="section">Go to website</a>
    </template>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import HTTP from '../api';

  export default {
    name: 'product',
    computed: {
      ...mapGetters(['list']),
    },
    data() {
      return {
        name: '',
        price: '',
        img: '',
        loading: true,
        error: null,
      };
    },
    props: ['url'],
    created() {
      if (!this.url.name) {
        HTTP.post(this.list ? `list/${this.list}/add` : 'link/crawl', this.url)
          .then((response) => {
            this.loading = false;

            this.name = response.data.name;
            this.price = response.data.price;
            this.img = response.data.image;
          })
          .catch((e) => {
            this.loading = false;
            this.error = `Unable to load your product : ${e}.`;
          });
      } else {
        this.loading = false;
        this.name = this.url.name;
        this.price = this.url.price;
        this.img = this.url.image;
      }
    },
  };
</script>

<style scoped lang="scss">
 section {
   height: 416px;

   .loading {
     font-weight: bold;
     margin: auto 0;
   }

   .error {
     margin: auto 0;
     font-weight: bold;
     color: #F44336;
   }

   h3 {
     height: 79px;
   }

   .price {
     font-size: 3em;
   }
 }
</style>
