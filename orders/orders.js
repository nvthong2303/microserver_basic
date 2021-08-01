const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');

mongoose.connect(`mongodb+srv://thong01:thong@mearn-learnit.bbq80.mongodb.net/orders?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('MongoDB connected!!');
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});

require('./Order');
const Order = mongoose.model('Order');

app.use(bodyParser.json());

app.post('/order', (req, res) => {
    const newOrder = {
        CustomerId: mongoose.Types.ObjectId(req.body.CustomerId),
        BookId: mongoose.Types.ObjectId(req.body.BookId),
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate,
    }
    const order = new Order(newOrder);
    order.save()
        .then(() => console.log('order saved'))
        .catch(err => {
            if(err){
                throw err;
            }
        })
    res.send('order created successfully')
})

app.get('/orders', (req, res) => {
    Order.find().then(orders => {
        res.json(orders)
    }).catch(err => {
        if(err) {
            throw err;
        }
    })
})

app.get('/order/:id', (req, res) => {
    Order.findById(req.params.id).then((order) => {
        if(order) {
            axios.get('http://localhost:3001/customer/' + order.CustomerId).then((response) => {
                const orderObject = { customerName: response.data.name, bookTitle: '' }

                axios.get('http://localhost:3000/book/' + order.BookId).then((response) => {
                    orderObject.bookTitle = response.data.title;
                    res.json(orderObject)
                })

            })
        } else {
            res.send('invalid order')
        }
    }).catch(err => {
        if(err){
            throw err;
        }
    })
})

app.listen(3002, () => console.log('server listening on port 3002'));