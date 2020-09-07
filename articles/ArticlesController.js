const express = require('express');
const { route } = require('../categories/CategoriesController');
const router = express.Router(); 
const category = require('../categories/Category');
const article  = require('./Article');
const slugify = require('slugify');

router.get('/admin/articles', (req, res) =>{
    article.findAll(
        // Faz relação entre as tabelas de categoria e artigo, o join
        {include:[{model: category}]},

        ).then(articles =>{
        res.render('admin/articles/index', {articles: articles, category: category});
    });

});

router.get('/admin/articles/new', (req, res) => {
    
    category.findAll().then(categories => {
        res.render('admin/articles/new', {category: categories});    
    });
    
});

router.post('/articles/save', (req, res) =>{
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    if(title!= undefined && body != undefined && category != undefined )
        article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category
        }).then( () => {
            res.redirect('/admin/articles');
        })
    
});


router.post('/articles/delete', (req, res) => {
    let id = req.body.id;
    if(id != undefined){
        
        if(!isNaN(id)){

            article.destroy({ // Apago o registro no banco de dados
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles');
            })

        }else{ // Não é um numero
            res.redirect('/admin/articles');    
        }
    }else{ // É igual a null 
        res.redirect('/admin/articles');
    }


})

router.get('/admin/articles/edit/:id', (req, res) =>{
    var id = req.params.id;
    
    article.findByPk(id).then(article =>{
        if(article != undefined){

            category.findAll().then(categories =>{
                res.render('admin/articles/edit', {category: categories, article: article});
            }); 
            
        }else{
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/');
    })
})

router.post('/articles/update', (req, res) =>{
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.cartegory;

    article.update({title: title, body: body, categoryId: category, slug:slugify(title)},{
        where :{
            id: id
        }
    }).then( () => {
        res.redirect('/admin/artcles');
    }).catch(err =>{
        res.redirect('/');
    })

});

router.get('/articles/page/:num', (req, res) =>{
    var page = req.params.num;
    var offset = 0;

    if( isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page) - 1) * 4;
    }

    article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ['id', 'desc']
        ]

    }).then(articles =>{

        var next;
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }
        
        var result = {
            page: parseInt(page),
            next : next,
            articles: articles,  
        }

        category.findAll().then(categories =>{
            res.render('admin/articles/page', {result: result, categories: categories});
        });

    });

})

module.exports = router;