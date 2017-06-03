const express = require('express');
const router = express.Router();
const pool = require('../config/db_pool.js');
const jwt = require('jsonwebtoken');


router.post('/', async function(req, res){
    try {
        var connection = await pool.getConnection();
        const email = req.body.email;
        const password = req.body.password;
        let query = 'select id, password from user where email = ?';
        let user_info = await connection.query(query, email) || null;

        if(password!=user_info[0].password) res.status(401).send({message: 'wrong email or password'});
        else {
          //jwt 발급하고 성공메세지 보내주기
          let option = {
            algorithm : 'HS256',
            expiresIn : 60 * 60 * 24 //토큰만료기간 : 하루
          };
          let payload = {
            user_id: user_info[0].id
          };
          let token = jwt.sign(payload, req.app.get('jwt-secret'), option);
          res.status(200).send({token : token});
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).send({message: err });
    }
    finally {
        pool.releaseConnection(connection);
    }

});

//promise-mysql로 게시글 상세조회
router.get('/:id', async (req, res) => {
    try {
      let token = req.headers.token;
      let decoded = jwt.verify(token,req.app.get('jwt-secret'));
      if(!decoded) res.status(400).send({message: 'wrong token '}); //내가 준 토큰이 아니면
      else { //인증이 된 토큰이면
        var connection = await pool.getConnection();
        await connection.beginTransaction();
        let query1 = 'update post set view_number = view_number + 1 where id = ?';
        await connection.query(query1, req.params.id);
        let query2 = 'select * from post where id = ?'; //게시글 가져오기
        let post = await connection.query(query2, req.params.id);
        let query3 = 'select writer, written_time, content from comment where post_id = ?'; //게시글에 달린 댓글들 가져오기
        let comments = await connection.query(query3, req.params.id);
        res.status(200).send( { result: { post: post[0], comment: comments }, message: 'ok' });
        await connection.commit();
      }

    }
    catch(err){
        console.log(err);
        res.status(500).send( { message: err });
        await connection.rollback();
    }
    finally{
        pool.releaseConnection(connection);
    }

});

module.exports = router;
