const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const dotenv = require('dotenv')
const cors = require('cors')
//const fileUpload = require('express-fileupload');


const User = require('./models/user')

dotenv.config();

const app = express()

mongoose.connect(process.env.URL_DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
} , (err) => {
    if(err) {
        console.log(err);
    }else {
        console.log('Connected to mongodb');
    }
})

app.use(cors())
app.use(morgan('dev'))
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ limit: '50mb',extended: false}))
//app.use(fileUpload());


//* raw boy 
// var contentType = require('content-type')
// var getRawBody = require('raw-body')
 
// app.use(function (req, res, next) {
//   getRawBody(req, {
//     length: req.headers['content-length'],
//     limit: '100mb',
//     encoding: contentType.parse(req).parameters.charset
//   }, function (err, string) {
//     if (err) return next(err)
//     req.text = string
//     next()
//   })
// })

//* require apis
const productRoutes = require('./routes/product')
const categoryRoutes = require('./routes/category')
const ownerRoutes = require('./routes/owner')
const userRoutes = require('./routes/auth')
app.use('/api' , productRoutes)
app.use('/api' , categoryRoutes)
app.use('/api' , ownerRoutes)
app.use('/api' , userRoutes)

PORT = process.env.PORT || 4000;

app.listen(PORT , console.log(`server is running on ${PORT}`))