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

            <v-img height="250" v-bind:src="x[1].images[0]"><