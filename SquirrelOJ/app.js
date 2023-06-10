var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
const fs = require('fs');
const { exec } = require('child_process');
var app = express();
var port = 8881;
var path = __dirname + '/views/'; //因為我把html都放在views裡面
var uri = 'mongodb://127.0.0.1:27017/mydata';
//引入cookie
const cookieParser = require('cookie-parser');
app.use(cookieParser());
//靜態檔案目錄
app.use(express.static('public'));
//解碼方式
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 初始GET
app.get('/', (req, res) => {
  res.sendFile(path + 'index.html');
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
  console.log('已成功連接到 MongoDB 資料庫');
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
  console.log('已成功連接到 MongoDB 資料庫');
  const Problem = await mongoose.model('problem', problemSchema);
  //將出題內容丟上資料庫
  const problemDoc = await new Problem(req.body);
  await problemDoc.save().then(saveDoc => {
    console.log('文件已保存' + saveDoc);
  }).catch(error => {
    console.log('文件保存失敗' + error);
  });
  res.status(200).send();
});
app.post('/problems/getAll', async function (req, res) {
  await mongoose.connect(uri);
  console.log('已成功連接到 MongoDB 資料庫');
  const Problem = mongoose.model('problem', problemSchema);
  try {
    const problems = await Problem.find({}, '_id TITLE CLASS TAG');
    if (problems) {
      res.json(problems);
    } else {
      res.status(404).json({ error: 'Problem not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
/******************************************/
/********************判分******************/
app.post('/processProblem', async (req, res) => {
  console.log('HI');
  const code = req.body.code; // 接收发送的程式码
  const problemId = req.body.id; // 接收发送的 ID

  try {
    await mongoose.connect(uri);
    console.log('已成功连接到 MongoDB 数据库');

    const Problem = mongoose.model('problem', problemSchema);
    const problemDoc = await Problem.findById(problemId);

    if (!problemDoc) {
      throw new Error('找不到指定的问题文档');
    }

    const hdArray = problemDoc.hd_array;
    //Cd
    process.chdir(__dirname + '\\public' + '\\judge\\');
    // 将程式码写入 code.txt
    fs.writeFileSync('code.txt', code);
    // 遍历 hd_array
    for (let i = 0; i < hdArray.length; i++) {
      const input = hdArray[i][0];
      const answer = hdArray[i][1];
      console.log(__dirname);
      // 将 input 写入 input.txt
      fs.writeFileSync('input.txt', input);

      // 将 answer 写入 answer.txt
      fs.writeFileSync('answer.txt', answer);

      // 执行 judge.py 脚本
      exec('python judge.py', (error, stdout, stderr) => {
        if (error) {
          console.error(`执行 judge.py 脚本时出错: ${error}`);
          res.status(500).send('执行 judge.py 脚本时出错');
        } else {
          const result = stdout.trim();
          console.log(`judge.py 脚本返回值: ${result}`);
          // 这里可以对结果进行进一步处理
          // 例如，将结果存储到数据库或发送给客户端
        }
      });
    }

    res.status(200).send('处理问题文档成功');
  } catch (error) {
    console.error(`处理问题文档时出错: ${error}`);
    res.status(500).send('处理问题文档时出错');
  }
});

/****************登入、登出*****************/
//登入session
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 99999 },
  resave: false,
  saveUninitialized: true
}));
app.get('/logout/submit', (req, res) => {
  req.session.destroy();
});
app.get('/login.html', (req, res) => {
  // 如果有 token Cookie，直接進入個人頁面
  if (req.session.name)
    res.sendFile(path + 'problems.html');
  else
    res.sendFile(path + 'login.html');
});
//登入送出
app.post('/login/submit', async (req, res) => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('已成功連接到 MongoDB 資料庫2');

    if (mongoose.models['user']) {
      // 如果模型已經存在，可以使用已經定義的模型
      delete mongoose.models['user'];
    }
    // 定義新的模型
    var User = mongoose.model('user', {
      name: String,
      username: String,
      password: String,
      password2: String,
      email: String
    });
    var { username, password } = req.body;
    var newUser = await User.findOne({ username, password }).exec();
    console.log('newUser.email=' + newUser.email);
    if (newUser) {
      //設session
      console.log("newUser.name=" + newUser.name);
      req.session.name = newUser.name;
      res.redirect("/problems.html");
    } else {
      res.send('帳號或密碼錯誤');
    }
  } catch (error) {
    console.log('資料庫連線錯誤:', error);
    res.status(500).send('無法連線至資料庫');
  }
});
app.post('/session/getname', (req, res) => {
  console.log("req.session.name=" + req.session.name);
  if (req.session.name)
    res.json({ name: req.session.name });
  else
    res.json({ name: false });
});

// 把新用戶存入資料庫
app.post('/register/submit', express.urlencoded({ extended: true }), (req, res) => {
  const { name, username, password, password2, email } = req.body;
  const user = { name, username, password, password2, email };
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('已成功連接到 MongoDB 資料庫');
      const db = mongoose.connection.db;
      const usersCollection = db.collection('users');
      usersCollection.insertOne(user)
        .then(() => {
          console.log('帳號密碼已成功儲存至資料庫');
          res.redirect("/login.html");
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
/*********************************************/
// 啟動伺服器
app.listen(port, () => {
  console.log(`伺服器正在監聽 http://localhost:${port}/`);
});
