
<template>
  <div id="nav" class="fixed" style="margin-bottom: 100px;">
    <!-- <v-navigation-drawer v-model="sidebar" app mobile-break-point="959">
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->

    <v-app-bar app fixed dense shrink>
      <span class="d-none d-sm-flex d-md-none">
        <v-icon @click="sidebar = !sidebar"> </v-icon>
      </span>
      <v-toolbar-title>
        <router-link to="/Home" tag="span" style="cursor: pointer">
          <img src="../assets/logo.png" id="logo" />
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="mdi-microphone"
        class="mx-4 p-4"
        flat
        hide-details
        label="Search"
        prepend-inner-icon="mdi-magnify"
        solo-inverted
        v-model = "searchterm"
        v-on:keyup.enter="toSearch(searchterm)"
      ></v-text-field>
      <v-toolbar-items class="d-sm-none d-md-flex">
        <template v-for="item in menuItems">
          <v-btn
            text
            :key="item.title"
            :to="item.path"
            v-if="item.show"
            @click="item.method"
          >
            <v-icon left dark>{{ item.icon }}</v-icon>
            {{ item.title }}