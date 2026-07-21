#!/usr/bin/env zsh
# shellcheck shell=bash

URL="http://localhost:3000/api"
CONTENT_TYPE_JSON="Content-Type: application/json"

register() {
  curl -sS -X POST \
    "$URL/auth/register" \
    -H "$CONTENT_TYPE_JSON" \
    -d '{
      "username": "test_username4",
      "password": "testtest",
      "name": "Test Name"
    }' \
    -c cookie.txt
}

login() {
  curl -sS -X POST \
  "$URL/auth/login" \
  -H "$CONTENT_TYPE_JSON" \
  -d '{
    "username": "test_username2",
    "password": "testtest"
  }' \
  -c cookie.txt
}

getChatrooms() {
  curl -X GET \
  "$URL/chatrooms" \
  -H "$COOKIE_HEADER" \
  -b cookie.txt
}

createChatroom() {
  curl -X POST \
  "$URL/chatrooms" \
  -H "$CONTENT_TYPE_JSON" \
  -d '{
    "members": [12]
  }' \
  -b cookie.txt
}

updateChatroom() {
  curl -X PATCH \
  "$URL/chatrooms/5" \
  -H "$CONTENT_TYPE_JSON" \
  -d '{
    "name": "哇哈哈"
  }' \
  -b cookie.txt
}

joinChatroom() {
  curl -X POST \
  "$URL/chatrooms/5/members" \
  -H "$CONTENT_TYPE_JSON" \
  -d '{
    "userIds": [10]
  }' \
  -b cookie.txt
}

leaveChatroom() {
  curl -X DELETE \
  "$URL/chatrooms/5/members" \
  -H "$CONTENT_TYPE_JSON" \
  -d '{
    "userIds": [10]
  }' \
  -b cookie.txt
}

deleteChatroom() {
  curl -X DELETE \
  "$URL/chatrooms/5" \
  -H "$CONTENT_TYPE_JSON" \
  -b cookie.txt
}

getChatroom() {
  curl -X GET \
  "$URL/chatrooms/1" \
  -H "$CONTENT_TYPE_JSON" \
  -b cookie.txt
}

sendMessage() {
  curl -X POST \
  "$URL/chatrooms/1/messages" \
  -H "$CONTENT_TYPE_JSON" \
  -d '{
    "content": "Hi!"
  }' \
  -b cookie.txt
}

getMessages() {
  curl -X GET \
  "$URL/chatrooms/1/messages?cursor=2" \
  -H "$CONTENT_TYPE_JSON" \
  -b cookie.txt
}

case "$1" in
  register)
    register | jq
    ;;
  login)
    login | jq
    ;;
  getChatrooms)
    getChatrooms | jq
    ;;
  createChatroom)
    createChatroom | jq
    ;;
  updateChatroom)
    updateChatroom | jq
    ;;
  joinChatroom)
    joinChatroom | jq
    ;;
  leaveChatroom)
    leaveChatroom | jq
    ;;
  deleteChatroom)
    deleteChatroom | jq
    ;;
  getChatroom)
    getChatroom | jq
    ;;
  sendMessage)
    sendMessage | jq
    ;;
  getMessages)
    getMessages | jq
    ;;
  *)
    exit 1
    ;;
esac
