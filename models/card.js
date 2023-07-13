const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'поле `name` должно быть заполнено'],
      minlength: [2, 'минимальная длина поля `name` - 2'],
      maxlength: [30, 'максимальная длина поля `name` - 30'],
    },
    link: {
      type: String,
      required: [true, 'поле `link` должно быть заполнено'],
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'поле `link` содержит некорректный URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'поле `owner` должно быть заполнено'],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
