#!/usr/bin/env zsh

URL="http://localhost:3000/api"
CONTENT_TYPE_JSON="Content-Type: application/json"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInVzZXJuYW1lIjoidGVzdF91c2VybmFtZSIsIm5hbWUiOiJUZXN0IE5hbWUiLCJhdmF0YXIiOm51bGwsImlhdCI6MTc4MzQ5Njk2NSwiZXhwIjoxNzgzNTgzMzY1fQ.l_mCF4CB7EWZtXQRYIXRh6bayfzNamLNE5v5aonEeGA"
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
    "username": "test_username",
    "password": "testtest"
  }'
}

getChatrooms() {
  curl -X GET \
  "$URL/rooms" \
  -H "$AUTHORIZATION" \
}

createChatroom() {
  curl -X POST \
  "$URL/rooms" \
  -H "$CONTENT_TYPE_JSON" \
  -H "$AUTHORIZATION" \
  -d '{
    "members": [12]
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
  *)
    exit 1
    ;;
esac