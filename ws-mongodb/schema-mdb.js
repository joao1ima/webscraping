const mongoose = require('mongoose');

const blog = mongoose.model(
    'blog',
    mongoose.Schema({
        title: String,
        lead: String,
        date: String
    })
)

module.exports = blog;