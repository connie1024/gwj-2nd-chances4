
<template>
  <div>
    <v-card class="mx-auto" tile>
      <v-img height="200" v-bind:src="background"></v-img>
      <v-row style="margin-left:2.5%;position:absolute; top: 160px">
        <v-list-item>
          <v-list-item-avatar size="100">
            <img v-bind:src="profile" v-bind:alt="name" />
          </v-list-item-avatar>
          <v-list-item-content style="padding-top: 50px; width: 300px">
            <h5>{{ name }}</h5>

            <!-- <v-list-item-title class="title" style="margin-top:20px;">Injamamul Haque Sonet</v-list-item-title>
            <v-list-item-subtitle>Software Engineer | dokanee</v-list-item-subtitle> -->
          </v-list-item-content>
        </v-list-item>
      </v-row>
      <h4 style="padding-top: 70px; text-align: left; padding-left: 50px;">
        About:
      </h4>
      <h4
        style="text-align: left; padding-left: 50px;font-size: 17px; padding-bottom: 40px"
      >
        {{ biography }}
      </h4>
      <h3 style="padding-bottom: 30px">Welcome to {{ name }}'s shop!!</h3>
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
    </v-tabs>
    <div v-if="currentTab === 'Listings'">
      <UserListings
        v-bind:user="user"