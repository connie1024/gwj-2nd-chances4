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
                      <p><strong>Options:</strong> ${{ x[1]["Price"] }}</p>
                      <p>
                        <strong>Price:</strong>
                        ${{ x[1]["Price"] }} per
                        {{ x[1]["service"]["Interval"] }}
                      </p>
                      <p>
                        <strong>Description:</strong> {{ x[1]["Description"] }}
                      </p>
                      <p><strong>Location:</strong> {{ x[1]["Location"] }}</p>
                      <div class="my-2">
                        <strong>TimeListed:</strong>
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
      if (ownerId 