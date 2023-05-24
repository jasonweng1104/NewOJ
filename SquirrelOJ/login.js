const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/mydata';
const dbName = 'mydate';

const app = express();
const port = 3000;

// 設定靜態檔案目錄
app.use(express.static(path.join(__dirname)));

// 初始GET
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});
//讀取題庫資料庫的大綱題目
//app.get('/problems/page={page}',(req,res) => {

//})
//讀取題庫資料庫的詳細題目
//app.get('/p{page)',(req,res) => {

//})
//讀取個人檔案資料庫
//app.get('/myPage/id={id}',(req,res) => {

//})
//讀取個人頁面資料庫
//app.get('/myClass/id={id}',(req,res) => {

//})
//新增題目到題目資料庫
//app.post('/problemEditor',(req,res) => {

//})
// 判斷輸入
app.get('/myClass', async (req, res) => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('已成功連接到 MongoDB 資料庫2');

    if (mongoose.models['user']) {
      // 如果模型已經存在，可以使用已經定義的模型
      delete mongoose.models['user'];
     
    }
    // 定義新的模型
    var User = mongoose.model('user', {
      username: String,
      password: String,
    });


    var { username, password } = req.query;
    var user = await User.findOne({ username, password }).exec();

    if (user) {
      res.redirect(`http://localhost:3000/myClass.html`);
    } else {
      res.send('帳號或密碼錯誤');
    }
  } catch (error) {
    console.log('資料庫連線錯誤:', error);
    res.status(500).send('無法連線至資料庫');
  }
});


// 把新用戶存入資料庫
app.post('/register', express.urlencoded({ extended: true }), (req, res) => {
  const { id, username, password, password2, email } = req.body;
  const user = { id, username, password, password2, email };
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('已成功連接到 MongoDB 資料庫');
      const db = mongoose.connection.db;
      const usersCollection = db.collection('users');
      usersCollection.insertOne(user)
        .then(() => {
          console.log('帳號密碼已成功儲存至資料庫');
          res.send('帳號密碼已成功儲存至資料庫');
        })
        .catch(error => {
          console.log('儲存至資料庫時發生錯誤:', error);
          res.status(500).send('發生錯誤，無法儲存至資料庫');
        });
    })
    .catch(error => {
      console.log('資料庫連線錯誤:', error);
      res.status(500).send('無法連線至資料庫');
    });
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`伺服器正在監聽 http://localhost:${port}/login`);
});
