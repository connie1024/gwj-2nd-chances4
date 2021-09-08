
<template>
  <div>
    <v-tabs
      v-model="tab"
      background-color="orange accent-4"
      centered
      dark
      icons-and-text
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-on:click="fetchItems('all')">
        All
      </v-tab>

      <v-tab v-for="x in subcats" :key="x.id" v-on:click="fetchItems(x)">
        {{ x }}
      </v-tab>
    </v-tabs>

    <div class="flex" style="margin-left:40px; margin-right:40px;">
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

                <div class="grey--text ml-4">
                  {{ x[2] }} ({{ x[4] }} reviews)
                </div>
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
                  <strong>Deal at:</strong> {{ x[1]["Location"] }}
                </div>
                <div>
                  <strong>Price:</strong>
                  ${{ x[1]["Price"] }} per {{ x[1]["rent"]["Interval"] }}
                </div>
                <div class="my-2">
                  <strong>Posted:</strong>
                  <timeago
                    :datetime="x[1]['date'].toDate()"
                    :auto-update="60"
                    style="padding-left: 5px; font-weight: 100; font-size: 15px"
                  ></timeago>
                </div>
              </v-card-text>

              <v-divider class="mx-4"></v-divider>
              <v-card-actions>
                <v-btn
                  color="orange darken-2"
                  text
                  @click="getItemPage(x[0], x[6])"
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
  </div>
</template>

<script>
// import firebase from 'firebase'
import firebase from "firebase";
import { roomsRef } from "../../firebase";

export default {
  data() {
    return {
      items: [],
      profiles: [],
      subcats: [
        "Automobiles",
        "Property",
        "Books",
        "Games",
        "Electronics",
        "Miscellaneous",
      ],
      rating: 0,
      name: "",
      numRatings: 0,
      profileURL: "",
      user: localStorage.UID,
      date: new Date(),
    };
  },
  methods: {
    fetchItems: function(x) {
      // database.collection('Listings').get()
      // firebase.firestore().collection('Listings').get()
      this.items = [];
      if (x === "all") {
        firebase
          .firestore()
          .collection("Listings")
          .where("Type", "==", "rent")
          .orderBy("date", "desc")
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
                  if (res.docs[0].data().numRatings == 0) {
                    this.rating = 0;
                  } else {
                    this.rating = (
                      res.docs[0].data().Rating / res.docs[0].data().numRatings
                    ).toFixed(2);
                  }

                  this.name = res.docs[0].data().Name;
                  this.numRating = res.docs[0].data().numRatings;
                  this.profileURL = res.docs[0].data().ProfileURL;
                  this.items.push([
                    doc.id,
                    item,
                    this.rating,
                    this.name,
                    this.numRating,
                    this.profileURL,
                    item.UserID,
                  ]);
                });
            });
          });
      } else {
        firebase
          .firestore()
          .collection("Listings")
          .where("Type", "==", "rent")
          .where("Subcat", "==", x)
          .orderBy("date", "desc")
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
                  if (res.docs[0].data().numRatings == 0) {
                    this.rating = 0;
                  } else {
                    this.rating = (
                      res.docs[0].data().Rating / res.docs[0].data().numRatings
                    ).toFixed(2);
                  }
                  this.name = res.docs[0].data().Name;
                  this.numRating = res.docs[0].data().numRatings;
                  this.profileURL = res.docs[0].data().ProfileURL;
                  this.items.push([
                    doc.id,
                    item,
                    this.rating,
                    this.name,
                    this.numRating,
                    this.profileURL,
                    item.UserID,
                  ]);
                });
            });
          });
      }
      this.items.forEach((x) => {
        firebase
          .firestore()
          .collection("User")
          .doc(x[0])
          .get()
          .then((x) => {
            this.profiles.push(x);
          });
      });
    },
    contactOwner: async function(ownerId) {
      if (ownerId == this.user) {
        return alert("this is your own store!!!");
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
        params: { user: userId, tabs: "Listings" },
        props: true,
      });
    },
    getItemPage: function(listingID, userId) {
      this.$router.push({
        name: "itemPageRent",
        params: { listing: listingID, userId: userId },
      });
    },
  },
  created() {
    this.fetchItems("all");
  },
};
</script>

<style scoped></style>