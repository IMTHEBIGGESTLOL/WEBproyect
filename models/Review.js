const {mongoose} = require("../DB/connectDB")
const {User} = require("./User");

let reviewSchema = mongoose.Schema({
    uid: {
        type: String,
        unique: true,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creation_date: {
        type: String,
        format: Date,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    }
})