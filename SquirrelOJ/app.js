var express = require('express');
var mongoose = require('mongoose');
var app = express();
var port = 3001;
var path = __dirname + '/views/'; //因為我把html都放在views裡面
var uri = 'mongodb://127.0.0.1:27017/mydata';

// 設定靜態檔案目錄
app.use(express.static('public'));
//解碼方式
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 初始GET
app.get('/', (req, res) => {
  res.sendFile(path + 'index.html');
});
app.get('/login.html', (req, res) => {
  res.sendFile(path + 'login.html');
});
app.get('/myClass.html', (req, res) => {
  res.sendFile(path + 'myClass.html');
});
app.get('/myPage.html', (req, res) => {
  res.sendFile(path + 'myPage.html');
});
app.get('/p.html', async (req, res) => {
  res.sendFile(path + 'p.html');
  console.log(req.query.ID);
});
app.get('/problemEditor.html', (req, res) => {
  res.sendFile(path + 'problemEditor.html');
});
app.get('/problems.html', (req, res) => {
  res.sendFile(path + 'problems.html');
});
app.get('/register.html', (req, res) => {
  res.sendFile(path + 'register.html');
});
app.post('/p/submit/', async (req, res) => {
  //送出答案按鈕
  //將答案程式碼拿去判分
});
/*****************出題與印題*************/
const Schema = mongoose.Schema;
const problemSchema = new Schema({
  id: Number,
  TITLE: String,
  EXPLAIN: String,
  INPUT: String,
  OUTPUT: String,
  CLASS: String,
  TAG: String,
  ex_num: Number,
  hd_num: Number,
  ex_array: [[String]],
  hd_array: [[String]]
});
app.get('/p/getProblem/:ID', async (req, res) => {
  await mongoose.connect(uri);
  console.log('已成功連接到 MongoDB 資料庫2');
  // 搜索数据并提取变量
  const problemId = req.params.ID; // 要搜索的问题 ID
  const Problem = new mongoose.model('problem', problemSchema);
  try {
    const problem = await Problem.findById(problemId);
    if (problem) {
      res.json(problem);
    } else {
      res.status(404).json({ error: 'Problem not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/problemEditor/submit', async (req, res) => {
  //送出出題按鈕
  await mongoose.connect(uri);
  console.log('已成功連接到 MongoDB 資料庫2');
  const Problem = mongoose.model('problem', problemSchema);
  //將出題內容丟上資料庫
  const problemDoc = new Problem(req.body);
  problemDoc.save().then(saveDoc => {
    console.log('文件已保存' + saveDoc);
  }).catch(error => {
    console.log('文件保存失敗' + error);
  });
});
/******************************************/
//資料庫
app.get('/login/submit', async (req, res) => {
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
      res.redirect("http://localhost:" + port + "/myClass.html");
    } else {
      res.send('帳號或密碼錯誤');
    }
  } catch (error) {
    console.log('資料庫連線錯誤:', error);
    res.status(500).send('無法連線至資料庫');
  }
});

// 把新用戶存入資料庫
app.post('/register/submit', express.urlencoded({ extended: true }), (req, res) => {
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
  console.log(`伺服器正在監聽 http://localhost:${port}/`);
});
