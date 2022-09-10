const mongoose = require('mongoose');

const OpinionSchema = new mongoose.Schema({
    opinion: {
        type: String,
        required: true,
        trim: true,
      },
      poll: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        default: 'public',
        enum: ['public', 'private'],
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
});

module.exports = mongoose.model('Opinion', OpinionSchema);