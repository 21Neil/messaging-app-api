# Messaging App API

以 Node.js、Express 與 PostgreSQL 建立的聊天應用程式後端，提供帳號驗證、好友管理、聊天室、文字訊息及圖片上傳功能。圖片透過 Sharp 轉換為 WebP 後儲存於 Cloudflare R2。

## 功能

- 註冊、登入、登出與查詢目前登入者，使用 bcrypt 雜湊密碼及 JWT Cookie 驗證。
- 更新顯示名稱、頭像、密碼與最後上線時間。
- 傳送、接受好友邀請，查詢好友、待處理邀請及移除好友。
- 建立聊天室、修改名稱、加入成員、退出與刪除聊天室。
- 傳送文字與圖片訊息，讀取聊天室成員及訊息。
- 透過登入驗證及聊天室成員檢查限制 API 存取。

目前使用 HTTP API，尚未實作 WebSocket 或伺服器主動推播；前端須主動呼叫 API 更新資料。

## 技術

| 用途 | 技術 |
| --- | --- |
| 執行環境 | Node.js、JavaScript ES Modules |
| HTTP 服務 | Express 5、cors、cookie-parser |
| 資料庫 | PostgreSQL、Prisma、pg |
| 身分驗證 | jsonwebtoken、bcrypt |
| 輸入驗證 | Zod |
| 圖片處理 | Multer（記憶體儲存）、Sharp |
| 物件儲存 | Cloudflare R2、AWS SDK for S3 |

## 專案結構

```text
.
├── lib/prisma.js           # Prisma Client 與 PostgreSQL adapter
├── prisma/schema.prisma    # 資料模型
├── prisma.config.js        # Prisma CLI 設定
├── src/
│   ├── app.js              # Express 入口、CORS 與錯誤處理
│   ├── routes/             # API 路由
│   ├── controllers/        # 請求與回應處理
│   ├── services/           # 業務邏輯、資料庫與 R2 操作
│   ├── middleware/         # 登入與聊天室成員驗證
│   ├── schemas/            # Zod 驗證規則
│   └── utils/              # JWT、Cookie、圖片壓縮與錯誤工具
├── test_api.sh             # 手動 API 呼叫腳本
└── package.json
```

主要資料模型為 `User`、`Friendships`、`Chatroom` 與 `Messages`。使用者與聊天室為多對多關係；訊息屬於一個聊天室及一位發送者。刪除聊天室時，資料庫會連帶刪除訊息。

## 本機啟動

### 1. 準備環境

需要 Node.js、npm、可連線的 PostgreSQL 資料庫，以及用於圖片功能的 Cloudflare R2 Bucket 與存取金鑰。

### 2. 設定環境變數

在專案根目錄建立 `.env`，填入自己的設定。以下皆為範例值：

```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/messaging_app?schema=public
SECRET=replace-with-a-long-random-secret
CORS_ORIGIN=http://localhost:5173
API_BASE_URL=http://localhost:3000

R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com 
R2_BUCKET_NAME=your-bucket-name
```

| 變數 | 說明 |
| --- | --- |
| `NODE_ENV` | 本機使用 `development`；`production` 時驗證 Cookie 會啟用 `secure`，須透過 HTTPS 傳送。 |
| `PORT` | 服務埠號，預設 `3000`。 |
| `DATABASE_URL` | PostgreSQL 連線字串，供 Prisma CLI 與應用程式使用。 |
| `SECRET` | JWT 簽署與驗證密鑰。 |
| `CORS_ORIGIN` | 允許的前端來源；多個來源以逗號分隔，不加空白。程式啟動時會直接讀取此變數，必須設定。 |
| `API_BASE_URL` | 後端對外網址，不包含 `/api`，結尾不加 `/`；用於產生頭像與訊息圖片網址。 |
| `R2_ACCESS_KEY_ID` | R2 存取金鑰 ID。 |
| `R2_SECRET_ACCESS_KEY` | R2 存取金鑰密碼。 |
| `R2_ENDPOINT` | R2 的 S3 相容 API 端點。 |
| `R2_BUCKET_NAME` | 儲存圖片的 Bucket 名稱。 |

### 3. 安裝相依套件與初始化資料庫

先設定 `.env` 再安裝，因為 `postinstall` 會執行 `prisma generate`。

```bash
npm install
npx prisma db push
```

### 4. 啟動 API

```bash
npm run dev
```

預設 API 基底網址為 `http://localhost:3000/api`。

## 身分驗證

註冊與登入成功後，伺服器會設定名為 `token` 的 HttpOnly Cookie，JWT 與 Cookie 有效期皆為一天。受保護的 API 從 Cookie 讀取 JWT。

瀏覽器跨來源請求須帶上 Cookie，例如：

```js
const response = await fetch('http://localhost:3000/api/auth/me', {
  credentials: 'include',
});
const data = await response.json();
```

前端來源也須包含在 `CORS_ORIGIN` 中。`GET /api/auth/me` 回傳 JWT 中的使用者資料，而非重新查詢資料庫。

## API

以下路徑皆以 `/api` 為前綴。除註冊、登入與登出外，所有端點皆須攜帶登入 Cookie。一般請求使用 `Content-Type: application/json`，檔案上傳使用 `multipart/form-data`。

### 帳號驗證

| 方法 | 路徑 | 請求內容 | 說明 |
| --- | --- | --- | --- |
| POST | `/auth/register` | `{ "username": "alice", "password": "password123", "name": "Alice" }` | 註冊並登入，回傳 `{ message, data }`。 |
| POST | `/auth/login` | `{ "username": "alice", "password": "password123" }` | 登入並設定 Cookie。 |
| DELETE | `/auth/logout` | 無 | 清除登入 Cookie。 |
| GET | `/auth/me` | 無 | 回傳 `{ user }`，包含 JWT 使用者資料。 |

註冊及登入的帳號限制為 3～30 字元，只接受英文字母、數字與底線；密碼為 8～100 字元。顯示名稱為 1～50 字元，帳號與顯示名稱會先移除頭尾空白。

### 使用者

| 方法 | 路徑 | 請求內容 | 說明 |
| --- | --- | --- | --- |
| PATCH | `/users/name` | `{ "name": "新名稱" }` | 更新顯示名稱並重新設定 JWT Cookie。 |
| PATCH | `/users/avatars` | 表單欄位 `avatar`（檔案）、`oldAvatarUrl`（完整網址） | 更新頭像並重新設定 JWT Cookie；未附 `avatar` 時將資料庫頭像欄位設為 `null`。 |
| GET | `/users/avatars/:key` | 無 | 讀取頭像圖片串流。 |
| PATCH | `/users/password` | `{ "password": "舊密碼", "newPassword": "新密碼" }` | 檢查舊密碼並更新，成功後清除目前的登入 Cookie。 |
| POST | `/users/heartbeat` | 無 | 更新目前使用者的 `lastSeenAt`。 |

頭像上傳目前會直接解析 `oldAvatarUrl`，因此即使沒有舊頭像，也須提供可由 `new URL()` 解析的完整網址。上傳新頭像時，程式會取網址最後一段作為舊檔案 key 並嘗試刪除該檔案。頭像以不放大原圖為原則，縮放至 100 × 100 範圍並轉成 WebP。

### 好友

| 方法 | 路徑 | 請求內容 | 說明 |
| --- | --- | --- | --- |
| GET | `/friends` | 無 | 取得好友陣列，依帳號升冪排序。 |
| GET | `/friends/invitations` | 無 | 取得收到且尚未處理的邀請，依建立時間降冪排序。 |
| POST | `/friends` | `{ "username": "bob" }` | 傳送好友邀請。 |
| PATCH | `/friends` | `{ "id": 1 }` | 接受邀請，`id` 為好友邀請 ID。 |
| DELETE | `/friends/:friendId` | 無 | 移除好友，`friendId` 為對方使用者 ID。 |
| GET | `/friends/statuses` | 無 | 線上狀態查詢端點；目前實作有參數與關聯篩選問題，詳見下方限制。 |

好友關係具有 `PENDING`、`ACCEPTED` 兩種狀態；禁止邀請自己或重複建立既有關係。只有邀請接收者可接受邀請。

### 聊天室

| 方法 | 路徑 | 請求內容 | 說明 |
| --- | --- | --- | --- |
| GET | `/chatrooms` | 無 | 回傳 `{ chatroom: [...] }`，包含成員，依 `lastMessageAt` 降冪排序。 |
| POST | `/chatrooms` | `{ "name": "聊天室", "members": ["bob"] }` | 建立聊天室，`name` 可省略；目前登入者會自動加入。 |
| GET | `/chatrooms/:id` | 無 | 回傳 `{ chatroom }`，包含成員及訊息。 |
| PATCH | `/chatrooms/:id` | `{ "name": "新聊天室名稱" }` | 更新聊天室名稱。 |
| POST | `/chatrooms/:id/members` | `{ "usernames": ["charlie"] }` | 由現有成員加入其他使用者。 |
| DELETE | `/chatrooms/:id/members` | 無 | 目前登入者退出聊天室；無剩餘成員時刪除聊天室。 |
| DELETE | `/chatrooms/:id` | 無 | 刪除聊天室及其資料庫訊息。 |

所有帶 `:id` 的聊天室路徑及其訊息路徑皆會驗證目前使用者是否為該聊天室成員。目前任何聊天室成員皆可修改名稱、加入其他使用者或刪除聊天室。

建立聊天室的 `members` 與加入成員的 `usernames` 都使用帳號字串，陣列中請勿重複帳號；`members` 不必包含目前登入者。

### 訊息

| 方法 | 路徑 | 請求內容 | 說明 |
| --- | --- | --- | --- |
| POST | `/chatrooms/:id/messages` | `{ "content": "你好！" }` | 傳送文字訊息，類型為 `text`。 |
| POST | `/chatrooms/:id/messages/images` | 表單欄位 `image`（檔案） | 傳送圖片訊息，類型為 `image`，`content` 儲存圖片 API 網址。 |
| GET | `/chatrooms/:id/messages/images/:imgKey` | 無 | 讀取聊天室圖片串流。 |

圖片縮放至 1080 × 1080 範圍內，保留比例且不放大原圖，轉成 WebP 後儲存於 R2 的 `chatrooms/<聊天室 ID>/`；頭像則儲存於 `avatars/`。圖片讀取同樣需要登入 Cookie，聊天室圖片另需通過成員驗證。

訊息目前由 `GET /chatrooms/:id` 一併取得，依 `createAt` 升冪取前 50 筆，即最早的 50 筆，尚未提供分頁或獨立的 `GET /chatrooms/:id/messages`。
