const router = require('express').Router()
const Owner = require('../models/owner')

//* POST req
router.post('/owners' , async (req , res) => {
    try {
        const owner = new Owner()
        owner.name = req.body.name
        owner.about = req.body.about
        owner.photo = req.body.photo

        await owner.save()

        res.json({
            status: true,
            message: 'Successfully create a owner'
        })
    
    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
})

//* GET req
router.get('/owners' , async(req, res) => {
    try {
        let owners = await Owner.find()
        res.json({
            status: true,
            owners: owners
        })
    } catch(err) {
        res.status(500).json({
            status: false,
            message: err.message
        })
    }
})


module.exports = router