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
