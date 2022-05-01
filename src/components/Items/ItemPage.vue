
<template>
  <div>
    <br />
    <br />
    <h1 v-for="(x, i) in itemInfo" v-bind:key="i">
      {{ x[1].Title }} for {{ x[1].Type }}
    </h1>
    <v-container>
      <v-row no-gutters>
        <v-col v-for="(x, i) in itemInfo" v-bind:key="i" md="12">
          <v-card color="grey lighten-4">
            <v-card-text>
              <v-row no-gutters>
                <v-col md="6">
                  <v-card color="grey lighten-4">
                    <v-carousel>
                      <v-carousel-item
                        v-for="(item, i) in x[1].images"
                        :key="i"
                        :src="item"
                      ></v-carousel-item>
                    </v-carousel>
                    <!-- <v-img
                      height="600"
                      :width="600"
                      v-bind:src="x[1].images[0]"
                    ></v-img> -->
                  </v-card>
                </v-col>
                <v-col md="6">
                  <v-card color="grey lighten-4">
                    <v-card-actions>
                      <v-list-item class="grow" style="font-weight: 700">
                        <v-list-item-avatar color="grey darken-3">
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

                      <div style="padding-left: 5px">
                        {{ x[2] }} ({{ x[4] }} reviews)
                      </div>
                    </v-row>
                    <v-card-text class="text-left">
                      <p>
                        <strong>Description:</strong> {{ x[1]["Description"] }}
                      </p>
                      <p v-if="x[1].Price != ''">
                        <strong>Price:</strong> ${{ x[1]["Price"] }}
                      </p>
                      <p v-if="x[1]['sale']['Alternatives'] != ''">
                        <strong>Can also trade for:</strong>
                        {{ x[1]["sale"]["Alternatives"] }}
                      </p>
                      <p v-if="x[1]['sale']['Transaction method']">
                        <strong>Transaction method:</strong>
                        {{ x[1]["sale"]["Transaction method"] }}
                      </p>
                      <p><strong>Location:</strong> {{ x[1]["Location"] }}</p>
                      <div class="my-2">
                        <strong>Posted:</strong>
                        <timeago
                          :datetime="x[1]['date'].toDate()"
                          :auto-update="60"
                          style="padding-left: 5px; font-weight: 100; font-size: 15px"
                        ></timeago>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="warning" @click="contactOwner(userId)">
                Chat Now
              </v-btn>
              <v-btn color="white" @click="toReviews">
                See all reviews
              </v-btn>
              <v-btn color="error" @click="reportListing">
                Report Listing
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// import firebase from 'firebase'
import firebase from "firebase";
import { roomsRef } from "../../firebase";

export default {
  props: ["listing", "userId"],
  data() {
    return {
      itemInfo: [],
      rating: 0,
      name: "",
      numRatings: 0,
      profileURL: "",
      user: localStorage.UID,
    };
  },
  methods: {
    reportListing: function() {
      alert("This listing has been reported, Thanks for your feedback!");
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
        roomsRef
          .where("users", "==", [ownerId, this.user])
          .get()
          .then(async (res) => {
            await roomsRef
              .doc(res.docs[0].id)
              .collection("messages")
              .add({
                content:
                  "I am interested in " +
                  this.itemInfo[0][1].Title +
                  "\n" +
                  "Type: " +
                  this.itemInfo[0][1].Type +
                  "\n" +
                  "Subcat: " +
                  this.itemInfo[0][1].Subcat +
                  "\n" +
                  "Location: " +
                  this.itemInfo[0][1].Location,
                file: {
                  extension: "png",
                  name: this.itemInfo[0][1].Title,
                  type: "image/png",
                  url: this.itemInfo[0][1].images[0],
                },
                sender_id: this.user,
                timestamp: new Date(),
              });
            await roomsRef
              .doc(res.docs[0].id)
              .update({ lastUpdated: new Date() });
          });
        return this.$router.push({ path: `/chat` });
      }

      let query2 = await roomsRef
        .where("users", "==", [this.user, ownerId])
        .get();

      if (!query2.empty) {
        console.log("hello");
        roomsRef
          .where("users", "==", [this.user, ownerId])
          .get()
          .then(async (res) => {
            console.log(res.docs[0].id);
            await roomsRef
              .doc(res.docs[0].id)
              .collection("messages")
              .add({
                content:
                  "I am interested in " +
                  this.itemInfo[0][1].Title +
                  "\n" +
                  "Type: " +
                  this.itemInfo[0][1].Type +
                  "\n" +
                  "Subcat: " +
                  this.itemInfo[0][1].Subcat +
                  "\n" +
                  "Location: " +
                  this.itemInfo[0][1].Location,
                file: {
                  extension: "png",
                  name: this.itemInfo[0][1].Title,
                  type: "image/png",
                  url: this.itemInfo[0][1].images[0],
                },
                sender_id: this.user,
                timestamp: new Date(),
              });
            await roomsRef
              .doc(res.docs[0].id)
              .update({ lastUpdated: new Date() });
          });
        console.log(query2.docs);
        return this.$router.push({ path: `/chat` });
      }
      roomsRef
        .add({
          users: [ownerId, this.user],
          lastUpdated: new Date(),
        })
        .then((res) => {
          roomsRef
            .where("users", "==", [this.user, ownerId])
            .get()
            .then(async () => {
              await roomsRef
                .doc(res.id)
                .collection("messages")
                .add({
                  content:
                    "I am interested in " +
                    this.itemInfo[0][1].Title +
                    "\n" +
                    "Type: " +
                    this.itemInfo[0][1].Type +
                    "\n" +
                    "Subcat: " +
                    this.itemInfo[0][1].Subcat +
                    "\n" +
                    "Location: " +
                    this.itemInfo[0][1].Location,
                  file: {
                    extension: "png",
                    name: this.itemInfo[0][1].Title,
                    type: "image/png",
                    url: this.itemInfo[0][1].images[0],
                  },
                  sender_id: this.user,
                  timestamp: new Date(),
                });
              await roomsRef.doc(res.id).update({ lastUpdated: new Date() });
            });
          this.$router.push({ path: `/chat` });
        });
    },
    toReviews: function() {
      this.$router.push({
        path: "/Shopfront",
        name: "Shopfront",
        params: { user: this.userId, tabs: "reviews" },
        props: true,
      });
    },
    fetchItem: function(listing) {
      if (listing) {
        localStorage.setItem("lastItemViewed", listing);
      } else {
        listing = localStorage.getItem("lastItemViewed");
      }
      this.itemInfo = [];
      firebase
        .firestore()
        .collection("Listings")
        .doc(listing)
        .get()
        .then((doc) => {
          let item = doc.data();
          firebase
            .firestore()
            .collection("users")
            .where("id", "==", item.UserID)
            .get()
            .then((res) => {
              this.rating = res.docs[0].data().Rating;
              this.name = res.docs[0].data().Name;
              this.numRating = res.docs[0].data().numRatings;
              this.profileURL = res.docs[0].data().ProfileURL;
              this.itemInfo.push([
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
    },
  },
  components: {},
  created() {
    this.fetchItem(this.listing);
  },
};
</script>

<style scoped>
/*  */
</style>