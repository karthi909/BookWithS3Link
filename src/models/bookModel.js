const mongoose = require('mongoose')

let ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },
    excerpt: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        ref: "User",
        required: true
        
    },
    ISBN: {
        type: String,
        require: true,
        unique: true
    },
    category: {
        type: String,
        require: true,
    },

    subcategory: { 
        type: [String],
        required: true
    }, 

    reviews: {
        type: Number,
        default: 0,
    },

    deletedAt: {
        type: Date,
        default: null
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    releasedAt: {
        type: String,
        required: true
    },

    bookCover:{
        type: String,
        required: true
    }

}, { timestamps: true })

module.exports = mongoose.model('Book', bookSchema)