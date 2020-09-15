const express = require('express');
const router = express.Router();
const user = require('./user');
const bcrypt = require('bcryptjs');
const User = require('./user');



router.get('/admin/users', (req, res) => {
    User.findAll().then(users =>{
        
        res.render('admin/users/index', {users: users});
    });

});

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create'); 
});

router.post('/users/create', (req, res) =>{
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({where:{email: email}}).then( user => {
        if(user == undefined){
            
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(() =>{
                res.redirect('/');
            }).catch((err) => {
                res.redirect('/');
            });

        }else{
            res.redirect('/admin/users/create');
        }
    })


});

router.get('/login', (req, res)=>{
    res.render('admin/users/login');
});

router.post('/authenticate', (req, res)=>{
    let emailUser = req.body.email;
    let password = req.body.password;

    user.findOne({where:{email: emailUser}}).then(user =>{
        if(user != undefined){
            // Valido a senha do usuario, fazendo a "descriptografia" 
            let correct = bcrypt.compareSync(password, user.password);
            
            if(correct){
                // Se o usuario logar no sistema, crio uma sessão
                req.session.admin = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles');
                
            }else{
                res.redirect('/login');
            }
        }else{
            res.redirect('/login');
        }
    });

});

router.get('/logout', (res, req) => {
    req.session.admin = undefined;
    res.redirect('/');

});

module.exports = router;