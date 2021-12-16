<template>
  <div style="margin-top: 50px">
    Searching for '{{ this.searchterm }}'
    <v-tabs
      v-model="tab"
      background-color="orange accent-4"
      centered
      dark
      icons-and-text
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-on:click="fetchItems('sale')">
        Sale/Trade
      </v-tab>

      <v-tab v-on:click="fetchItems('rent')">
        Rental
      </v-tab>
    </v-tabs>
    <div v-if="this.items.length === 0">
      No search results found!
    </div>
    <div class="flex">
      <v-row style="">
        <v-col
          v-for="(x, i) in items"
          v-bind:key="i"
          col="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card :loading="false" class="mx-auto my-12" max-width="374">
            <v-card-actions>
              <v-list-item class="grow" style="font-weight: 700">
                <v-list-item-avatar
                  color="grey darken-3"
                  @click="goToShopFront(x[6])"
                >
                  <img v-bind:src="x[5]" class="elevation-6" alt="" />
                </v-list-item-avatar>
                {{ x[3] }}
              </v-list-item>
            </v-card-actions>
            <v-row
              align="center"
              class="mx-0"
              style="margin-bottom: 10px; padding-left: 20px;"
            >
              <v-rating
                v-bind:value="x[2]"
                color="amber"
                dense
                half-increments
                readonly
                size="14"
              ></v-rating>

              <div class="grey--text ml-4">{{ x[2] }} ({{ x[4] }} reviews)</div>
            </v-row>
            <template slot="progress">
              <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
              ></v-progress-linear>
            </template>

            <v-img height="250" v-bind:src="x[1].images[0]"></v-img>

            <v-card-title>{{ x[1]["Title"] }}</v-card-title>

            <v-card-text>
              <div class="my-2 subtitle-1">
                <strong>Location:</strong> {{ x[1]["Location"] }}
              </div>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>
            <v-card-actions>
              <v-btn
                color="orange darken-2"
                text
                @click="getItemPage(x[0], x[6])"
                v-if="currentTab === 'sale'"
              >
                View
              </v-btn>
              <v-btn
                color="orange darken-2"
                text
                @click="getItemRentalPage(x[0], x[6])"
                v-if="currentTab === 'rent'"
              >
                View
              </v-btn>
              <v-btn color="orange darken-2" text @click="contactOwner(x[6])">
                Contact
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { roomsRef } from "../../firebase";

export default {
  data() {
    return {
      name: "",
      profile: "",
      rating: 0,
      numRatings: 0,
      profileURL: "",
      items: [],
      searchterm: "",
      currentTab: "sale",
      user: localStorage.UID,
    };
  },
  components: {},
  created() {
    this.fetchItems("sale");
  },
  methods: {
    getItemRentalPage: function(listingID, userId) {
      this.$router.push({
        name: "itemPageRent",
        params: { listing: listingID, userId: userId },
      });
    },
    getItemPage: function(listingID, userId) {
      this.$router.push({
        name: "itemPage",
        params: { listing: listingID, userId: userId },
      });
    },
    contactOwner: async function(ownerId) {
      if (ownerId == this.user) {
        return alert("this is your own store!");
      }
      //const chatRoomUsers = [ownerId, this.user];
      const query1 = await roomsRef
        .where("users", "==", [ownerId, this.user])
        .get();

      if (!query1.empty) {
        return this.$router.push({ path: `/chat` });
      }

      let query2 = await roomsRef
        .where("users", "==", [this.user, ownerId])
        .get();

      if (!query2.empty) {
        return this.$router.push({ path: `/chat` });
      }
      roomsRef
        .add({
          users: [ownerId, this.user],
          lastUpdated: new Date(),
        })
        .then(() => {
          this.$router.push({ path: `/chat` });
        });
    },
    goToShopFront: function(userId) {
      this.$router.push({
        path: "/Shopfront",
        name: "Shopfront",
        params: { user: userId },
        props: true,
      });
    },
    fetchItems: function(x) {
      // database.collection('Listings').get()
      // firebase.firestore().collection('Listings').get()
      this.searchterm = this.$route.params.searchterm;
      this.currentTab = x;
      this.items = [];
      firebase
        .firestore()
        .collection("Listings")
        .where("Type", "==", x)
        .get()
        .then((querySnapShot) => {
          querySnapShot.forEach(async (doc) => {
            let item = doc.data();
            //console.log(item.UserID);
            await firebase
              .firestore()
              .collection("users")
              .where("id", "==", item.UserID)
              .get()
              .then((res) => {
                this.rating = res.docs[0].data().Rating;
                this.name = res.docs[0].data().Name;
                this.numRating = res.docs[0].data().numRatings;
                this.profileURL = res.docs[0].data().ProfileURL;
                if (
                  item["Title"]
                    .toLowerCase()
                    .includes(this.searchterm.toLowerCase())
                ) {
                  this.items.push([
                    doc.id,
                    item,
                    this.rating,
                    this.name,
                    this.numRating,
                    this.profileURL,
                    item.UserID,
                  ]);
                }
              });
          });
        });
      // console.log("title"