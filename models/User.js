const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    images: [
        {
            title: { type: String, required: true },
            path: { type: String, required: true },
            order: { type: Number, default: 0 },
        },
    ],
});
module.exports = mongoose.model('User', userSchema);
