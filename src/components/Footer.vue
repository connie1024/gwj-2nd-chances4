<template>
  <v-footer padless>
    <v-card flat tile class="orange lighten-1 white--text text-center">
      <v-card-text>
        <v-btn v-for="icon in icons" :key="icon" class="mx-4 white--text" ic