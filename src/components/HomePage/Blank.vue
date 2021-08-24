
<template>
  <v-app style="margin-top: 50px">
  {{this.searchterm}}
  </v-app>
</template>
<script>

export default {
  components: {

  },
  data() {
    return {
      searchterm: "",
    };
  },
  methods: {
    fetchItems: function() {
      this.searchterm = this.$route.params.searchterm; 
      this.$router.push({ name: 'search', params: { searchterm: this.searchterm } }) 
      }
  },
  created() {
    this.fetchItems();
  },
};
</script>
<style scoped>
</style>