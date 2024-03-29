# [109-2] Web Programming Final

## 專題題目名稱 ：(Group 63) 記帳網站

## Demo video

https://youtu.be/FcF4B1LdbHk

## 這個服務在做什麼

記帳網站幫助使用者記錄每一天的支出，提供使用者選擇日期，輸入支出名稱、金額以及支出種類，在頁面底下也顯示了當日的支出總金額，提供使用者去衡量還可以花多少錢。

## Deployed link

http://34.81.105.213:3000/

## Github link

https://github.com/b06505031/final

## 使用/操作方式

使用者須輸入使用者名稱以及密碼(密碼為預設第一次登入時所輸入的密碼)，登入後可選擇日期(預設為使用者所使用當日)，接著輸入支出項目名稱，選擇種類、輸入支出金額最後按 Add 即可將支出項目匯入表格中，表格我們預設 5 項為一頁，超過需換頁，頁面底下顯示所選擇日期之總支出金額。在頁面最右上方點選 Menu 後可選擇修改密碼或登出。選擇修改密碼後會跳至修改密碼頁面，修改完後按下 ChangePassword 即可成功修改並跳至登入後頁面。登出則回到初始畫面。

## 使用與參考之框架/模組/原始碼

- 前端：react
- 後端：websocket
- 資料庫：MongoDB

## 使用之第三方套件、框架、程式碼

- 前端：react-antd、react-hooks
- 後端：websocket、v4
- 資料庫：MongoDB

## 每位組員之負責項目

- 黃冠評：前端畫面以及 CSS 排版。
- 韋昊臣：後端以及資料庫連接。

## 專題製作心得

- 黃冠評：這次專題讓我在撰寫前端的畫面以及 css 排版上更加熟悉，此外，也更熟悉 javascript 各種方法的使用，最重要的是讓我在解決 react 的問題上有更多經驗。
- 韋昊臣：這次專題負責後端以及資料庫連接的部分，在實際操作的過程中雖然有遇到一些難題，但也讓我學會了自己解決問題的能力，讓我對 websocket 的部分有了更深入的了解。

## 安裝方式

### frontend

1. 進入 frontend 執行 `npm install` 安裝必要套件
2. 進入 frontend 執行 `yarn start` 開啟 localhost:3000 顯示畫面，接者跟去操作方法操作即可。

```
cd frontend
npm install
yarn start
```

### backend

1. 進入 backend 執行 `npm install` 安裝必要套件

```
cd backend
npm install
```

2. 在 backend 底下新增 .env 並加入此行 `MONGO_URL=<自己的mongoDB連結>`
3. 進入 backend 執行 `yarn server` 開啟後端以及連接資料庫

```
yarn server
```
