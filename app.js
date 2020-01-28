const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const locationRouter = require('./routes/location');

const MONGODB_URI = "mongodb+srv://nik:nik@cluster0-ymjnp.mongodb.net/sos?retryWrites=true&w=majority";

const app = express();

var port = process.env.PORT || 6900

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/loc', locationRouter);

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(result => {
    console.log("DB Connected!!");
    app.listen(port);
}).catch(err => {
    console.log(err);
});