
<template>
  <div>
    <v-card class="mx-auto" tile>
      <v-img height="200px" v-bind:src="background"></v-img>
      <v-row style="margin-left:2.5%;position:absolute;top:160px">
        <v-list-item>
          <v-list-item-avatar size="100">
            <img v-bind:src="profile" v-bind:alt="name" />
          </v-list-item-avatar>
          <v-list-item-content style="padding-top: 50px; width: 500px">
            <h5>{{ name }}</h5>

            <!-- <v-list-item-title class="title" style="margin-top:20px;">Injamamul Haque Sonet</v-list-item-title>
            <v-list-item-subtitle>Software Engineer | dokanee</v-list-item-subtitle> -->
          </v-list-item-content>
          <template>
            <v-row style="padding-left: 30px">
              <v-dialog v-model="dialog" persistent max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="mx-2"
                    fab
                    dark
                    small
                    color="orange"
                    style="margin-top:30px;"
                    v-on="on"
                    v-bind="attrs"
                  >
                    <v-icon dark>
                      mdi-pencil
                    </v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">User Profile</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field
                            label="Name*"
                            required
                            v-bind:value="name"
                            v-model="name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <v-col cols="12" md="12">
                            <v-textarea
                              solo
                              name="input-7-4"
                              label="Biography / about"
                              v-bind:value="biography"
                              v-model="biography"
                            ></v-textarea>
                          </v-col>
                        </v-col>
                        <v-col cols="12">
                          <v-btn
                            class="mx-2"
                            dark
                            small
                            color="orange"
                            @click="clickProfile"
                          >
                            Update Profile
                          </v-btn>
                          <input
                            type="file"
                            ref="input1"
                            style="display: none"
                            @change="previewImage"
                            accept="image/*"
                          />
                          <v-list-item-avatar size="100">
                            <img v-bind:src="profile" v-bind:alt="name" />
                          </v-list-item-avatar>
                        </v-col>
                        <v-col cols="12">
                          <v-btn
                            class="mx-2"
                            dark
                            small
                            color="orange"
                            @click="clickBackground"
                          >
                            Update Background
                          </v-btn>
                          <input
                            type="file"
                            ref="background"
                            style="display: none"
                            @change="previewBackground"
                            accept="image/*"
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">
                      Close
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="
                        dialog = false;
                        updateUser();
                      "
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-row>
          </template>
        </v-list-item>
      </v-row>
      <h4 style="padding-top: 70px; text-align: left; padding-left: 50px;">
        About:
      </h4>
      <h4 v-if="biography === ''">
        You have no biography yet! lets fill in some!
      </h4>

      <h4
        style="text-align: left; padding-left: 50px;font-size: 17px; padding-bottom: 40px"
      >
        {{ biography }}
      </h4>
    </v-card>
    <br /><br />
    <v-tabs
      v-model="tab"
      background-color="orange accent-4"
      centered
      dark
      icons-and-text
    >
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-on:click="currentTab = 'Listings'">
        Listings
      </v-tab>

      <v-tab v-on:click="currentTab = 'reviews'">
        Reviews
      </v-tab>
      <v-tab v-on:click="currentTab = 'history'">
        History
      </v-tab>
    </v-tabs>

    <div v-if="currentTab === 'Listings'">
      <UserListings
        v-bind:user="user"
        v-bind:profile="true"
        v-bind:rating="rating"
        v-bind:numRatings="numRatings"
        v-bind:name="name"
        v-bind:profileURL="profile"
        v-bind:isSameUser="isSameUser"
      ></UserListings>
    </div>
    <div v-if="currentTab === 'reviews'">
      <Reviews v-bind:shopOwner="user"></Reviews>
    </div>
    <div v-if="currentTab === 'history'">
      <History
        v-bind:user="user"
        v-bind:profile="true"
        v-bind:rating="rating"
        v-bind:numRatings="numRatings"
        v-bind:name="name"
        v-bind:profileURL="profile"
        v-bind:isSameUser="isSameUser"
      ></History>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import UserListings from "./UserListings";
import Reviews from "./Reviews";
import History from "./History";

export default {
  props: ["user"],
  data() {
    return {
      currentTab: "Listings",
      name: "",
      email: "",
      profile: "",
      rating: 0,
      biography: "",
      dialog: false,
      currentid: "",
      isSameUser: false,
      profileData: "",
    };
  },
  components: {
    UserListings,
    Reviews,
    History,
  },
  created() {
    console.log("yoyoyo" + this.user);
    this.currentid = localStorage.UID;

    if (this.user === undefined) {
      this.user = localStorage.UID;
    }
    this.isSameUser = this.currentid === this.user;
