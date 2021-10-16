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
