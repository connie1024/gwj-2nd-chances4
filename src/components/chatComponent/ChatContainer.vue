<template>
  <div class="window-container" :class="{ 'window-mobile': isDevice }">
    <chat-window
      :height="screenHeight"
      :theme="theme"
      :styles="styles"
      :current-user-id="currentUserId"
      :room-id="roomId"
      :rooms="loadedRooms"
      :loading-rooms="loadingRooms"
      :messages="messages"
      :messages-loaded="messagesLoaded"
      :rooms-loaded