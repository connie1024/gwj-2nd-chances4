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
      :rooms-loaded="roomsLoaded"
      :room-actions="roomActions"
      :menu-actions="menuActions"
      :room-message="roomMessage"
      @fetch-more-rooms="fetchMoreRooms"
      @fetch-messages="fetchMessages"
      @send-message="sendMessage"
      @edit-message="editMessage"
      @delete-message="deleteMessage"
      @open-file="openFile"
      @open-user-tag="openUserTag"
      @room-action-handler="menuActionHandler"
      @menu-action-handler="menuActionHandler"
      @send-message-reaction="sendMessageReaction"
      @typing-message="typingMessage"
      @toggle-rooms-list="$emit('show-demo-options', $event.opened)"
    >
    </chat-window>
  </div>
</template>

<script>
import {
  firebase,
  roomsRef,
  messagesRef,
  usersRef,
  filesRef,
  deleteDbField,
  storage,
} from "../../firebase";
import { parseTimestamp, isSameDay } from "../../utils/dates";
import ChatWindow from "vue-advanced-chat";
import "vue-advanced-chat/dist/vue-advanced-chat.css";
// import ChatWindow, { Rooms } from 'vue-advanced-chat'
// import ChatWindow from 'vue-advanced-chat'
// import 'vue-advanced-chat/dist/vue-advanced-chat.css'
// import ChatWindow from './../../dist/vue-advanced-chat.umd.min.js'

export default {
  co