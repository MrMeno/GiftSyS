/*create by MrM */
/*2019-12-13*/
/*lastmodified:2019-12-16*/
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const resolve = file => path.resolve(__dirname, file)
const index = require('./api/index')
const listener = require('./api/listen')
const app = express()
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use('/api', index)
app.use('/listener', listener)
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

const port = process.env.PORT || 8080 //端口监听开启
app.listen(port, () => {
    console.log(`server started at localhost:${port}`)
})