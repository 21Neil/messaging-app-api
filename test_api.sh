#!/usr/bin/env zsh

URL="http://localhost:3000/api"
CONTENT_TYPE_JSON="Content-Type: application/json"

register() {
  curl -X POST \
    "$URL/auth/register" \
    -H "$CONTENT_TYPE_JSON" \
    -d '{
      "username": "test_username2",
      "password": "testtest",
      "name": "Test Name"
    }'
}

login() {
  curl -X POST \
  "$URL/auth/login" \
  -H "$CONTENT_TYPE_JSON" \
  -d '{
    "username": "test_username",
    "password": "testtest",
  }'
}

getChatrooms() {
  curl -X GET \
  "$URL/rooms/1" \
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
  *)
    exit 1
    ;;
esac