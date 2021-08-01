const mongoose = require('mongoose');

mongoose.model("Book", {

    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        require: true
    },
    numberPages: {
        type: Number,
        require: false
    },
    publisher: {
        type: String,
        require: false
    }
})