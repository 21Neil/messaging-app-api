# 專案協作規範

本文件適用於整個 repository。修改前先閱讀目標功能及相鄰模組，沿用既有架構與 API 契約。使用者的明確要求優先；子目錄若有 `AGENTS.md`，其規則適用於該目錄。

## 專案背景

- Node.js、JavaScript ES Modules（`package.json` 的 `type: module`）、Express 5。
- PostgreSQL、Prisma；schema 位於 `prisma/schema.prisma`，共用 client 位於 `lib/prisma.js`。
- Zod 負責輸入驗證；JWT 搭配 HTTP-only cookie 驗證身分。
- bcrypt 處理密碼；multer、sharp 與 Cloudflare R2 處理圖片。
- API 前綴為 `/api`，功能包含 auth、users、chatrooms、messages、friends。
- 預設以繁體中文溝通，程式識別字使用英文。

## 目錄與責任

| 位置 | 責任 |
| --- | --- |
| `src/app.js` | 應用啟動、共用 middleware、API 掛載與集中錯誤處理 |
| `src/routes/api.router.js` | 功能 router 掛載與共用身分驗證 |
| `src/routes/*.router.js` | HTTP method、路徑、middleware 與 controller 綁定 |
| `src/controllers/*.controller.js` | 取出並驗證請求資料、呼叫 service、組成 HTTP 回應、傳遞錯誤 |
| `src/services/*.service.js` | 業務規則、資料存取、跨資源操作與外部服務整合 |
| `src/schemas/*.schema.js` | Zod schema 與可重用的輸入限制 |
| `src/middleware/*.middleware.js` | 身分驗證、資源存取檢查及請求前置處理 |
| `src/utils/*.js` | 聚焦、可重用的工具，例如錯誤、token、cookie 與圖片處理 |
| `lib/prisma.js` | 共用 Prisma client；各模組直接匯入使用 |
| `prisma/schema.prisma` | 資料模型、關聯、enum 與資料庫約束 |

新增功能預設沿用 router → controller → service。不要為單一功能額外引入 repository、DTO、class、依賴注入容器或通用基底層。既有授權 middleware 可直接查詢 Prisma；業務流程仍放在 service。

## Coding style

- 使用兩格縮排、單引號、分號及多行結構的尾逗號。
- 使用 `const`；只有需要重新賦值時使用 `let`，不使用 `var`。
- 使用 `import` / `export`，相對匯入寫出 `.js` 副檔名，不混入 CommonJS。
- 功能函式採 named export 與箭頭函式：`export const getChatrooms = async (...) => { ... };`。
- Router 採 default export；controller 通常以 `import * as friendshipService` 匯入對應 service。
- 檔案採 `<feature>.<layer>.js`，例如 `friendship.service.js`。
- 函式、變數使用 camelCase；真正的常數使用 UPPER_SNAKE_CASE；boolean 使用 `is`、`has`、`can` 等表意前綴。
- 多個 service 參數使用具名物件並解構，例如 `({ receiverId, friendshipId })`，避免依賴參數順序。
- ID 使用具體名稱，如 `receiverId`、`senderId`、`roomId`；不要混用 ID、username 或整個 user 物件。
- 使用 `async` / `await`，避免混用 `.then()`；簡單 Prisma service 可沿用 `return await prisma...`。
- 優先使用物件屬性簡寫；以空行區分輸入整理、驗證、資料操作與回傳。
- 簡短 guard clause 可省略大括號，複雜或多行分支使用大括號；避免巢狀三元運算與深層分支。
- 保留既有公開識別字，例如 `sentFriendship`、`applyFriendship` 與 schema 的 `createAt`；不要順手改名或擴大格式化範圍。

## Controller 與路由

- Router 只綁定路徑與處理函式，不放查詢或業務邏輯。
- 需要登入的功能沿用 `authenticated`；操作者身分取自 `req.user`，不可相信 body 傳入的操作者 ID。
- Controller 保持簡短；將多步驟且必須一致完成的業務流程交給 service。
- 延續 `try / catch` 與 `next(err)` 的錯誤傳遞方式，即使 Express 5 支援 async 錯誤轉送，也不要混用不同風格。
- 使用 `return res.status(...).json(...)`，避免回應後繼續執行或重複回應。
- 新增資源路由採名詞與合適的 HTTP method，固定路徑應放在可能攔截它的動態參數路徑前。
- 修改前確認 `api.router.js` 的掛載路徑與巢狀 router；不要僅依 controller 名稱推測完整 URL。
- 保持既有 endpoint 的 status、JSON 結構、欄位與 cookie 行為。新 API 依同模組契約設計，成功訊息沿用英文，業務錯誤沿用繁體中文。
- 清單沒有資料時回傳空清單，不視為找不到資源；不要無需求就替既有 API 加統一回應 wrapper。

## 輸入驗證與錯誤處理

- 在請求邊界使用 Zod 驗證 body、params、query；驗證後使用解析結果 `result.data`。
- 依既有方式使用 `safeParse`；驗證失敗回傳 `400` 與 `z.flattenError(result.error)`。
- 數字 ID 須驗證為有效正整數；單用 `+req.params.id` 無法排除 `NaN`、小數或負數。
- 驗證必要字串、長度、enum、清單大小及檔案是否存在；避免直接把 `req.body` 展開到 Prisma `data`。
- 業務錯誤使用 `throw createError(status, message, code)`，匯入 `src/utils/createError.js`，不要另建錯誤機制。
- 依語意使用 `400`（輸入或狀態不符）、`401`（未通過驗證）、`403`（無權限）、`404`（資源不存在）；衝突情境可採 `409`，但須維持既有契約。
- 非預期錯誤交由集中 handler 處理，不吞錯、不回傳假成功，也不把資料庫細節或 stack trace 暴露給用戶。
- 註解說明原因、限制或取捨，不逐行重述程式；不要留下臨時 `console.log` 或敏感資料輸出。

## Service、Prisma 與資料一致性

- Service 不依賴 `req`、`res`、`next`，以具名參數接收資料，回傳結果或拋出錯誤。
- 從 `lib/prisma.js` 匯入共用 `prisma`，不要在 request 或 service 內建立新的 PrismaClient。
- 以實際 schema 與生成 client 為準；使用 Prisma enum（例如 `FriendshipStatus.PENDING`），不要散落狀態字串。
- 對外使用者資料明確 `select` 所需欄位，例如 `id`、`username`、`name`、`avatar`；密碼雜湊不得出現在回應中。
- 查詢只取得必要欄位與關聯，避免迴圈逐筆查詢；清單提供明確排序。需要分頁時限制頁面大小並採穩定排序。
- 存取或修改他人可識別的資源時檢查擁有權、成員資格或接收者資格；取得有效 ID 不代表有權限。
- 相關寫入須一起成功時使用 Prisma transaction，例如新增訊息與更新聊天室最後訊息時間。
- 先查再寫可能有競態；視需求使用條件更新、唯一約束與交易，並處理約束衝突，不只依靠寫入前檢查。
- 資料庫交易無法回滾 R2 操作。跨資料庫與儲存服務的流程須考慮失敗補償，避免先刪除仍被使用的檔案。
- Schema 有改動時說明相容性、遷移與 client 生成需求；不要手動編輯 `generated/prisma`，也不要順手升級 Prisma 套件。

## Clean Code 與修改範圍

- 一個函式完成一個清楚任務，以業務意圖命名，使用 guard clauses 降低巢狀深度。
- 優先採用最小、直接且可讀的實作。只有出現實際重複或責任過多時才抽取 helper。
- 共用既有 `createError`、cookie options、token、圖片與儲存工具，避免複製實作。
- 不為預想中的需求新增參數、抽象層、設定或相依套件。
- 修改前讀取現有檔案並確認使用者的未提交變更；保留與任務無關的改動。
- 只修正任務相關問題；遇到其他缺陷時說明，不進行無關重構。
- 沿用風格不代表複製缺陷：漏寫 `return`、錯誤的 cookie 屬性、缺少驗證與除錯輸出不應成為新程式的範本。

## 驗證與常用指令

- `npm run dev`：使用 Node watch 啟動 `src/app.js`。
- `npm start`：啟動 API。
- `node --check <檔案路徑>`：檢查修改的 JavaScript 語法，不代表完成整合驗證。
- `npx prisma validate`：schema 有改動時驗證；`npx prisma generate`：需要時重新生成 client。
- 目前 `npm test` 是會失敗的預留指令，沒有已配置的測試框架、lint 或 formatter；不要宣稱它們已通過。
- `test_api.sh` 是手動 curl 腳本，依賴本機 API、cookie、測試帳號與 `jq`。使用前核對目前路由與 payload，腳本可能落後於實作。
- 純文件或低風險格式修改以內容檢查為主，不新增只重述實作的測試。
- 業務或權限行為有改動時，驗證正常結果、未登入、無權限、無效輸入、找不到資源及相關狀態邊界；有必要時加入聚焦的自動化測試。
- 使用隔離的測試資料驗證寫入；不要對未知或正式資料庫執行破壞性測試、reset 或 schema push。
- 不讀取或輸出 `.env`、cookie、JWT、密碼及 R2 憑證內容；需要設定時只說明變數名稱。
- 若環境或服務限制導致檢查失敗，明確回報已執行的檢查、失敗原因及尚未驗證的項目。

## 完成交付

以繁體中文簡潔說明實際改動與驗證結果。API 改動需提供 method、完整路徑、登入要求及關鍵請求／回應欄位；若有相容性變動或未完成驗證，直接說明。不要把預期結果描述成已執行成功的結果。
