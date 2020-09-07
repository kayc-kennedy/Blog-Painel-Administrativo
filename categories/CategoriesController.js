const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify'); // Transforma string em URL

router.get('/admin/categories/new', (req, res) =>{
    res.render('admin/categories/new');
})

router.post('/categories/save', (req, res)=>{
    var title = req.body.title;
    if(title != undefined){
        Category.create({
            title: title,
            slug: slugify(title)
             
        }).then(() => {
            res.redirect('/admin/categories/new');
        })

    }else{
        res.redirect('/admin/categories/new');
    }
})

router.get('/admin/categories', (req, res)=>{

    Category.findAll().then(categories=>{
        res.render('admin/categories/index', {categories:categories})    
    })

    
})

router.post('/categories/delete', (req, res) => {
    let id = req.body.id;
    if(id != undefined){
        
        if(!isNaN(id)){

            Category.destroy({ // Apago o registro no banco de dados
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/categories');
            })

        }else{ // Não é um numero
            res.redirect('/admin/categories');    
        }
    }else{ // É igual a null 
        res.redirect('/admin/categories');
    }


})


router.get('/admin/categories/edit/:id', (req, res) =>{
    let id = req.params.id;

    if(isNaN(id)){ // Se nao for um numero, redireciona
        res.redirect('admin/categories');
    }

    Category.findByPk(id).then(categoria => { //Busca uma categoria através do Id

        if(categoria != undefined){
             
            res.render('admin/categories/edit', {categoria: categoria});

        }else{
            res.redirect('admin/categories');
        }
   
    }).catch(erro => {

        res.redirect('admin/categories');
    
    })
});

router.post('/categories/update', (req, res)=>{
    let id =  req.body.id;
    let titulo = req.body.title; 

    // Atualizando categoria / titulo e slug
    Category.update({title: titulo, slug: slugify(titulo)}, {
        where: {
            id: id
        } 
    }).then(() =>{
        res.redirect('/admin/categories');
    });
})

module.exports = router;