const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://thong:thong@cluster0.mxncv.mongodb.net/customer?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('MongoDB connected!!');
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});

require('./Customer');
const Customer = mongoose.model('Customer');

app.post('/customer', (req, res) => {
    const newCustomer = {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address,
    }
    const customer = new Customer(newCustomer);
    customer.save()
        .then(() => console.log('customer saved'))
        .catch(err => {
            if(err){
                throw err;
            }
        })
    res.send('a customer created successfully');
})

app.get('/customers', (req, res) => {
    Customer.find().then(customers => {
        res.json(customers)
    }).catch(err => {
        if(err) {
            throw err;
        }
    })
})

app.get('/customer/:id', (req, res) => {
    Customer.findById(req.params.id).then(customer => {
        res.json(customer)
    }).catch(err => {
        if(err) {
            throw err;
        }
    })
})

app.delete('/customer/:id', (req, res) => {
    Customer.findOneAndRemove(req.params.id).then((customer) => {
        res.send('customer removed successfully');
    }).catch(err => {
        if(err) {
            throw err;
        }
    })
})

app.listen(3001, () => console.log('server listening on port 3001'))