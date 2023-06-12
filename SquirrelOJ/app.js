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
//登入session
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 9999999 },
  resave: false,
  saveUninitialized: true
}));
// 初始GET
app.get('/', (req, res) => {
  res.sendFile(path + 'index.html');
});
app.get('/myClass.html', (req, res) => {
  console.log(req.session.name);
  if (req.session.name)
    res.sendFile(path + 'myClass.html');
  else res.redirect('/login.html');
});
app.get('/myPage.html', (req, res) => {
  if (req.session.name)
    res.sendFile(path + 'myPage.html');
  else res.redirect('/login.html');
});
app.get('/p.html', async (req, res) => {
  res.sendFile(path + 'p.html');
  console.log(req.query.ID);
});
app.get('/problemEditor.html', (req, res) => {
  if (req.session.name)
    res.sendFile(path + 'problemEditor.html');
  else res.redirect('/login.html');
});
app.get('/problems.html', (req, res) => {
  res.sendFile(path + 'problems.html');
});
app.get('/register.html', (req, res) => {
  res.sendFile(path + 'register.html');
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
app.post('/checkSession', (req, res) => {
  if (req.session.name)
    res.status(200).end('');
  res.status(500).end('');
});
const util = require('util');
const execPromise = util.promisify(require('child_process').exec);

app.post('/processProblem', async (req, res) => {
  console.log('HI');
  const code = req.body.code; // 接收发送的程式码
  const problemId = req.body.id; // 接收发送的 ID
  const userId = req.session._id;
  try {
    await mongoose.connect(uri);
    console.log('已成功连接到 MongoDB 数据库');

    const Problem = mongoose.model('problem', problemSchema);
    const problemDoc = await Problem.findById(problemId);
    const User = mongoose.model('user', userSchema);
    console.log('userId:', userId);
    const userDoc = await User.findById(userId);
    console.log('userDoc:', userDoc);

    if (!problemDoc) {
      throw new Error('找不到指定的问题文档');
    }

    const hdArray = problemDoc.hd_array;
    //Cd
    process.chdir(__dirname + '\\public' + '\\judge\\');
    // 将程式码写入 code.txt
    fs.writeFileSync('code.txt', code);
    // 遍历 hd_array
    var ACflag = true;
    for (let i = 0; i < hdArray.length; i++) {
      const input = hdArray[i][0];
      const answer = hdArray[i][1];
      // 将 input 写入 input.txt
      fs.writeFileSync('input.txt', input);

      // 将 answer 写入 answer.txt
      fs.writeFileSync('answer.txt', answer);

      try {
        // 使用 await 等待 execPromise 执行完成
        const { stdout } = await execPromise('python judge.py');
        const result = stdout.trim();
        console.log('判斷' + result[0]);
        if (result[0] === 'F') {
          ACflag = false;
        }
        console.log(`judge.py 脚本返回值: ${result}`);
        // 这里可以对结果进行进一步处理
        // 例如，将结果存储到数据库或发送给客户端
      } catch (error) {
        console.error(`执行 judge.py 脚本时出错: ${error}`);
        res.status(500).send('执行 judge.py 脚本时出错');
        return; // 终止循环
      }
    }
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1; // 月份從0開始，需要加1
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var time = year + '/' + month + '/' + day + ' ' + hour + ':' + minute;
    if (ACflag) {
      console.log("我是AC人");
      userDoc.JU_array.push([problemDoc._id, problemDoc.TITLE, "<p id='AC'>AC</p>", time]);
      userDoc.AC_ids.push(problemDoc._id);
    } else {
      console.log("我是WA人");
      userDoc.JU_array.push([problemDoc._id, problemDoc.TITLE, "<p id='WA'>WA</p>", time]);
    }
    userDoc.save();
    res.status(200).send('处理问题文档成功');
  } catch (error) {
    console.error(`处理问题文档时出错: ${error}`);
    res.status(500).send('处理问题文档时出错');
  }
});

/****************登入、登出*****************/
const userSchema = new Schema({
  name: String,
  username: String,
  password: String,
  password2: String,
  email: String,
  AC_ids: [[String]],
  JU_array: [[String, String, String, String]] //ID, 題目名稱, 狀態, 時間
});
app.get('/logout/submit', (req, res) => {
  req.session.destroy();
  res.status(200).send();
});
app.get('/login.html', (req, res) => {
  // 如果有 token Cookie，直接進入個人頁面
  if (req.session.name)
    res.redirect('/problems.html');
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
    var User = mongoose.model('user', userSchema);
    var { username, password } = req.body;
    var newUser = await User.findOne({ username, password }).exec();
    if (newUser) {
      //設session
      req.session.name = newUser.name;
      req.session._id = newUser._id;
      req.session.email = newUser.email;
      res.redirect("/problems.html");
    } else {
      res.send('帳號或密碼錯誤');
    }
  } catch (error) {
    console.log('資料庫連線錯誤:', error);
    res.status(500).send('無法連線至資料庫');
  }
});
app.post('/session/getAll', (req, res) => {
  res.status(200).json({ name: req.session.name, email: req.session.email });
});
/**************個人網站渲染****************/
app.post('/myPage/getAll', async (req, res) => {
  try {
    const user_id = req.session._id;
    // 连接数据库
    await mongoose.connect(uri);
    console.log('已成功连接到 MongoDB 数据库');

    // 根据用户ID查询并获取用户数据
    const User = mongoose.model('user', userSchema);
    const user = await User.findById(user_id).exec();

    if (!user) {
      console.error('找不到指定的用户');
      res.status(404).send('找不到指定的用户');
    } else {
      // 在这里处理用户数据并发送给客户端
      res.status(200).json(user);
    }
  } catch (error) {
    console.error('查询用户数据时出错:', error);
    res.status(500).send('无法获取用户数据');
  }
});


/*****************************************/
// 把新用戶存入資料庫
app.post('/register/submit', express.urlencoded({ extended: true }), (req, res) => {
  const { name, username, password, password2, email } = req.body;
  var AC_ids = [], JU_array = [];
  const user = { name, username, password, password2, email, AC_ids, JU_array };
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
