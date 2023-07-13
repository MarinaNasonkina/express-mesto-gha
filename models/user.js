const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'поле `name` должно быть заполнено'],
      minlength: [2, 'минимальная длина поля `name` - 2'],
      maxlength: [30, 'максимальная длина поля `name` - 30'],
    },
    about: {
      type: String,
      required: [true, 'поле `about` должно быть заполнено'],
      minlength: [2, 'минимальная длина поля `about` - 2'],
      maxlength: [30, 'максимальная длина поля `about` - 30'],
    },
    avatar: {
      type: String,
      required: [true, 'поле `avatar` должно быть заполнено'],
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'поле `avatar` содержит некорректный URL',
      },
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
