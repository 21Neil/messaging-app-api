#!/usr/bin/env zsh

URL="http://localhost:3000/api"
CONTENT_TYPE_JSON="Content-Type: application/json"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInVzZXJuYW1lIjoidGVzdF91c2VybmFtZTIiLCJuYW1lIjoiVGVzdCBOYW1lIiwiYXZhdGFyIjpudWxsLCJpYXQiOjE3ODQxODYyNjksImV4cCI6MTc4NDI3MjY2OX0.XCTFUfr-MqIFNz7Ufoub9jt7g__RPlsxf7BpGWOUt1w"
AUTHORIZATION="AUTHORIZATION: Bearer $TOKEN"

register() {
  curl -X POST \
    "$URL/auth/register" \
    -H "$CONTENT_TYPE_JSON" \
    -d '{
      "username": "test_username3",
      "password": "testtest",
      "name": "Test Name"
    }'
}

login() {
  curl -X POST \
  "$URL/auth/login" \
  -H "$CONTENT_TYPE_JSON" \
  -d '{
    "username": "test_username2",
    "password": "testtest"
  }'
}

getChatrooms() {
  curl -X GET \
  "$URL/chatrooms" \
  -H "$AUTHORIZATION" \
}

createChatroom() {
  curl -X POST \
  "$URL/chatrooms" \
  -H "$CONTENT_TYPE_JSON" \
  -H "$AUTHORIZATION" \
  -d '{
    "members": [12]
  }'
}

updateChatroom() {
  curl -X PATCH \
  "$URL/chatrooms/1" \
  -H "$CONTENT_TYPE_JSON" \
  -H "$AUTHORIZATION" \
  -d '{
    "name": "偷偷計畫"
  }'
}

joinChatroom() {
  curl -X POST \
  "$URL/chatrooms/1/members" \
  -H "$CONTENT_TYPE_JSON" \
  -H "$AUTHORIZATION" \
  -d '{
    "userIds": [12]
  }'
}

leaveChatroom() {
  curl -X DELETE \
  "$URL/chatrooms/1/members" \
  -H "$CONTENT_TYPE_JSON" \
  -H "$AUTHORIZATION" \
  -d '{
    "userIds": [12]
  }'
}

deleteChatroom() {
  curl -X DELETE \
  "$URL/chatrooms/4" \
  -H "$CONTENT_TYPE_JSON" \
  -H "$AUTHORIZATION" \
}

getChatroom() {
  curl -X GET \
  "$URL/chatrooms/1" \
  -H "$CONTENT_TYPE_JSON" \
  -H "$AUTHORIZATION" \
}

sendMessage() {
  curl -X POST \
  "$URL/chatrooms/1/messages" \
  -H "$CONTENT_TYPE_JSON" \
  -H "$AUTHORIZATION" \
  -d '{
    "content": "Hi!"
  }'
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
  *)
    exit 1
    ;;
esac