const router = require('express').Router()
const Product = require('../models/product')
// var multer  = require('multer')
// var upload = require('../middlewares/upload-photo')
//const fileUpload = require('express-fileupload');



//* POST req- create a new product
router.post('/products',

  async (req ,res) => {
    try {
        let product = new Product()
        product.ownerID = req.body.ownerID
        product.categoryID = req.body.categoryID
        product.title= req.body.title
        product.description= req.body.description
        product.stockQuantity= req.body.stockQuantity
        product.photo = req.body.photo
        product.price = req.body.price

        await product.save()

        res.json({
            status: true,
            message: 'Successfully saved!'
        })
    } catch(err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
    
})



//* GEt req - get all products
router.get('/products' , async(req, res) => {
    try {
        let products = await Product.find().populate("owner category").exec()
        res.json({
            status: true,
            products: products
        })
    } catch(err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
})



//* GET req - get a single product
router.get('/products/:id' , async(req, res) => {
    try {
        let id = req.params.id
        let product = await Product.findOne({_id:id}).populate('owner category').exec()
        res.json({
            status: true,
            product: product
        })
    } catch(err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
})

//* PUT req - update a single product
router.put('/products/:id' , async(req, res) => {
    try {
        let id = req.params.id
        let product = await Product.findOneAndUpdate({_id:id}, {
            $set: {
                title: req.body.title,
                price: req.body.price,
                category: req.body.category,
                photo: req.file,
                description: req.body.description,
                owner: req.body.owner
            }
        },
        {upsert: true})
        res.json({
            status: true,
            updatedProduct: product
        })
    } catch(err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
})

//* DELETE req - delete a single product
router.delete('/products/:id', async(req,res) => {
    try {
        const id = req.params.id
        const deletedProduct = await Product.findOneAndDelete({_id:id})
        if (deletedProduct) {
            res.json({
                status : true,
                message: 'successfully deleted'
            })
        }
    }catch (err){
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
})



module.exports = router