const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

mongoose.connect(`mongodb+srv://thong01:thong@mearn-learnit.bbq80.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('MongoDB connected!!');
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});

require('./Book');
const Book = mongoose.model('Book');

app.get('/', (req, res) => {
    res.send('this is books services')
})

app.post('/books', (req, res) => {
    const newBook = {
        title: req.body.title,
        author: req.body.author,
        numberPages: req.body.numberPages,
        publisher: req.body.publisher
    }
    const book = new Book(newBook);
    book.save()
        .then(() => console.log('book saved'))
        .catch(err => {
            if(err){
                throw err;
            }
        })
    res.send('a book created successfully')
})

app.get('/books', (req, res) => {
    Book.find().then((books) => {
            res.json(books)
        }).catch(err => {
            if(err){
                throw err;
            }
        })
})

app.get('/book/:id', (req, res) => {
    Book.findById(req.params.id).then((book) => {
            if(book) {
                res.json(book);
            }else {
                res.sendStatus(404);
            }
        }).catch(err => {
            if(err){
                throw err;
            }
        })
})

app.delete('/book/:id', (req, res) => {
    Book.findOneAndRemove(req.params.id).then((book) => {
            res.send('book removed successfully');
        }).catch(err => {
            if(err){
                throw err;
            }
        })
})

app.listen(3000, () => console.log('server listening on port 3000'));