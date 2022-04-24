const express = require('express')
const app = express()
const port = 5000
const bodyparser = require('body-parser');
const {User} =require("./models/User");
const cookieParser =require('cookie-parser');
const config =require('./config/key');
const {auth} = require('./middleware/auth');

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI).then(()=> console.log('MongoDB Connected...'))
.catch(err=> console.log(err))



app.post('/api/users/register',(req,res) => {
  //회원가입 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body)
  
  user.save((err,userInfo)=>{
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      registerSuccess:true
    })
  })

})

app.post('/api/users/login',(req,res) => {
//요청된 이메일 찾기
User.findOne({ email: req.body.email},(err,user)=>{
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    //요청된 이메일의 비밀번화와 입력된 값을 확인
    user.comparePassword(req.body.password , (err, isMatch) => {
      if(!isMatch)
        return res.json({loginSuccess: false, message: "비밀번호가 틀림."})

      //토큰생성
      user.generateToken((err,user)=> {
        if(err) return res.status(400).send(err);

        //토큰 저장 공간 (쿠키)
        res.cookie("x_auth",user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id})
      })
    })
    
  })
})
//role 1 admin ..... role 2 특정 admin
// role 0 일반 유저
app.get('/api/users/auth', auth ,(req,res) =>{

  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })


})

app.get('/api/users/logout', auth, (req,res) => {
  User.findOneAndUpdate({_id: req.user._id},
    { token: ""}
    , (err,user)=>{
      if(err)return res.json({success:false, err});
      return res.status(200).send({
        success: true
      })
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})