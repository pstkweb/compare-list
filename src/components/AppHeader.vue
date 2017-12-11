<template>
  <header>
    <form action="" v-on:submit.prevent="addURI">
      <div class="field-group">
        <input v-model="uri" type="text" placeholder="URI" />
        <button type="submit" class="primary">Add</button>
      </div>
    </form>
  </header>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'appheader',
    data() {
      return { uri: '' };
    },
    methods: {
      ...mapActions(['add']),
      addURI() {
        try {
          this.uri.split(/\n/).forEach((uri) => {
            this.add(uri);
          });
          this.uri = '';
        } catch (e) {
          // TODO show alert
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  header {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;

    form {
      border: none;
      background: none;
      margin: 5px;
      padding: 0;

      .field-group {
        display: flex;

        textarea, input {
          flex: 1 0 8em;
          margin: 0;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }

        button, a {
          flex: 0 0 auto;
          margin: 0;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }
  }
</style>
