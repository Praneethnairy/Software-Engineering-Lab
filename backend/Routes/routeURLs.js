const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const bodyParser = require('body-parser');
// router.use(express.static("./public"))
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));

function generateAccessToken(username){
    return jwt.sign(username,process.env.TOKEN_SECRET); //If time constraint should be added - {expiresIn - 1600s}
    
}

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '9880055926',
    database : 'surveySoftware'
})
connection.connect((err)=>{
    if (err) throw err;
    else
        console.log('Connected to database');
})

// var storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, './public/images/')     // './public/images/' directory name where save the file
//     },
//     filename: (req, file, callBack) => {
//         callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//     }
// })

// var upload = multer({
//     storage: storage
// });

// router.post('/fileUpload',upload.single('image'),(req,res)=>{
//     if (!req.body.file) {
//         console.log("No file upload");
//     }
//     else {
//         console.log(req.file.filename)
//         var imgsrc = 'http://localhost:3000/images/' + req.file.filename
//         var insertData = "INSERT INTO fileUpload(url)VALUES(?)"
//         connection.query(insertData, [imgsrc], (err, result) => {
//             if (err) throw err
//             console.log("file uploaded")
//         })
//     }
// })

router.post('/signIn',(req,res)=>{
    connection.query(`select uid from user_credentials where uName = '${req.body.uName}' and password = '${req.body.passwd}';`,(err,result)=>{
        if(err) throw err;
        console.log(result);
        if(result.length === 0){
            res.status(500);
        }
        else{
            const token = generateAccessToken(result[0].uid);
            connection.query(`insert into user_sessions values('${token}',${result[0].uid});`)
            res.status(200).json({"authTok":token});
        }
    })
})

router. post('/validToken',(req,res)=>{
    connection.query(`select * from user_sessions where uToken = '${req.body.token}';`,(err,result)=>{
        if(err) throw err;
        if(result.length === 0){
            res.status(500);
        }
        else{
            let userInfo = connection.query(`select * from user_credentials where uid in (select uid from user_sessions where uToken = '${req.body.token}');`);
            res.status(200).json({"user":userInfo[0]});
        }
    })
})

router.post('/registerUser',(req,res)=>{
    connection.query(`select * from user_credentials where uName = '${req.body.uName}' and email = '${req.body.email}';`,(err,result)=>{
        if(err) throw err;
        if(result.length === 0){
            connection.query(`insert into user_credentials(uName, Password,email,name,Phno) values('${req.body.uName}','${req.body.uPass}', '${req.body.email}','${req.body.name}','${req.body.Phno}')`,(err1,result1)=>{
                if(err1) throw err1;
                else
                    res.status(200).json({"flag":true});
            });
        }
        else{
            res.status(200).json({"flag":false,"msg":"User Already Exists"});
        }
    })
})

router.post('/logOut',(req,res) => {
    connection.query(`delete from user_sessions where uToken = '${req.body.tok}'`,(err,result)=>{
        if(err) throw err;
        else{
            res.status(200).json({flag : true});
        }
    });
});

router.get('/getSurveys',(req,res)=>{
    connection.query(`select s.uid,s.sid,u.name,month(s.time) as mon,date(s.time) as time,s.surveyDetails,s.optA,s.optB,s.optC,s.optD from user_credentials as u join survey as s on u.uid = s.uid order by s.time desc;`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({details:result})
    })
})

router.post('/getPercentage',(req,res)=>{
    connection.query(`select selectOpt from selectedopt where sid = '${req.body.sid}';`,(err,result)=>{
        if(err) throw err;
        var opt1 = 0;
        var opt2 = 0;
        var opt3 = 0;
        var opt4 = 0;
        for(let i = 0;i<result.length;++i){
            if(result[i].selectOpt === '1'){
                opt1++;
            }
            else if(result[i].selectOpt === '2'){
                opt2++;
            }
            else if(result[i].selectOpt === '3'){
                opt3++;
            }
            else if(result[i].selectOpt === '4'){
                opt4++;
            }
        }
        res.status(200).json({opt1:((opt1*100)/result.length).toFixed(2),opt2:((opt2*100)/result.length).toFixed(2),opt3:((opt3*100)/result.length).toFixed(2),opt4:((opt4*100)/result.length).toFixed(2)})
    })
})

router.post('/checkSurveyed',(req,res)=>{
    connection.query(`select selectOpt from selectedopt where uid = user_id('${req.body.tok}') and sid = '${req.body.sid}';`,(err,result)=>{
        if(err) throw err;
        if(result.length === 0){
            res.status(200).json({flag:false});
        }
        else{
            
            res.status(200).json({flag:true,details:result[0]});
        }
    })
})

router.post('/optSelected',(req,res)=>{
    connection.query(`insert into selectedopt(sid,uid,selectOpt) values ('${req.body.sid}',user_id('${req.body.tok}'),'${req.body.opt}');`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({"status":"OK"});
    })
})

router.post('/postSurvey',(req,res)=>{
    connection.query(`insert into survey(uid,time,surveyDetails,optA,optB,optC,optD) values(user_id('${req.body.tok}'),curdate(),'${req.body.survey}','${req.body.opt1}','${req.body.opt2}','${req.body.opt3}','${req.body.opt4}');`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({status:"OK"});
    })
})

router.post('/deleteSurvey',(req,res)=>{
    connection.query(`delete from survey where sid = '${req.body.sid}';`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({status:"OK"});
    })
})

router.post('/getUid',(req,res)=>{
    connection.query(`select uid from user_sessions where uToken = '${req.body.tok}';`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({uid:result[0].uid});
    })
})

router.get('/campaigns',(req,res)=>{
    connection.query(`select c.uid,u.name,u.email,c.cid,c.shortDesc,c.longDesc,c.upVoteCount,c.downVoteCount from user_credentials as u join campaign as c on u.uid = c.uid order by c.upVoteCount desc;`,(err,result)=>{
        if(err) return err;
        res.status(200).json({details:result});
    })
})

router.post('/votedCampaign',(req,res)=>{
    connection.query(`insert into campaignvotedetails (cid,uid,voteType) values(${req.body.cid},user_id('${req.body.tok}'),'${req.body.type}')`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({status : "OK"});
    })
})

router.post('/deleteVotes',(req,res)=>{
    connection.query(`delete from campaignvotedetails where cid = '${req.body.cid}';`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({status:'OK'});
    })
});

router.post('/deleteVoted',(req,res)=>{
    connection.query(`delete from campaignvotedetails where cid = ${req.body.cid} and uid = user_id('${req.body.tok}');`,(err,result) =>{
        if(err) throw err;
        res.status(200).json({status:"OK"});
    });
})

router.post('/changeVote',(req,res)=>{
    connection.query(`update campaignvotedetails set voteType = '${req.body.type}' where cid = ${req.body.cid} and uid = user_id('${req.body.tok}');`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({status:'OK'});
    })
})

router.post('/checkVoted',(req,res)=>{
    connection.query(`select * from campaignvotedetails where cid = ${req.body.cid} and uid = user_id('${req.body.tok}');`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({row:result});
    })
})

router.post('/startCampaign',(req,res)=>{
    connection.query(`insert into campaign(uid,shortDesc,longDesc) values(user_id('${req.body.tok}'),'${req.body.short}','${req.body.long}');`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({status:'OK'});
    })
})

router.post('/deleteCampaign',(req,res)=>{
    connection.query(`delete from campaign where cid = '${req.body.cid}';`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({status:'OK'})
    })
})

router.post('/userName',(req,res)=>{
    connection.query(`select name from user_credentials where uid = user_id('${req.body.tok}');`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({name:result[0].name});
    })
})

module.exports = router;