
<template>
  <v-app style="margin-top: 50px">
    <div>
      <v-carousel
        cycle
        height="500"
        hide-delimiter-background
        show-arrows-on-hover
      >
        <v-carousel-item
          v-for="(item, i) in items"
          :key="i"
          :src="item.src"
        ></v-carousel-item>
      </v-carousel>
    </div>

    <br />
    <div>
      <!-- <v-card> -->
      <v-tabs
        v-model="tab"
        background-color="orange accent-4"
        centered
        dark
        icons-and-text
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab v-on:click="currentTab = 'sales'">
          Sales
        </v-tab>

        <v-tab v-on:click="currentTab = 'rentals'">
          Rental
        </v-tab>

        <v-tab v-on:click="currentTab = 'wish'">
          Wish List
        </v-tab>
      </v-tabs>
      <div v-if="currentTab === 'sales'"><Sales></Sales></div>
      <div v-if="currentTab === 'rentals'"><Rentals></Rentals></div>
      <div v-if="currentTab === 'wish'"><Wish></Wish></div>
    </div>
  </v-app>
</template>
<script>
import Sales from "./Sales";
import Rentals from "./Rentals";
import Wish from "./Wish";

export default {
  components: {
    Sales,
    Rentals,
    Wish,
  },
  data() {
    return {
      currentTab: "sales",
      items: [
        {
          src: require("../../assets/poster.png"),
        },
        {
          src: require("../../assets/poster1.png"),
        },
        {
          src: require("../../assets/poster2.png"),
        },
        {
          src: require("../../assets/poster3.jpg"),
        },
        {
          src: "https://klgadgetguy.com/wp-content/uploads/2020/08/Shopee.jpg",
        },
      ],
      tabs: null,
      text: "asdasdasdasdsads",
      listings: {
        sale: {},
        rental: {},
        service: {},
      },
    };
  },
  methods: {},
  created() {},
};
</script>
<style scoped>
/* v-tab {
  position: sticky;
} */
</style>