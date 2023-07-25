const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UnauthorizedError = require('../errors/unauthorized-err');

const { regexLink } = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'поле `email` должно быть заполнено'],
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'поле `email` содержит некорректный email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: [2, 'минимальная длина поля `name` - 2'],
      maxlength: [30, 'максимальная длина поля `name` - 30'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'минимальная длина поля `about` - 2'],
      maxlength: [30, 'максимальная длина поля `about` - 30'],
    },
    avatar: {
      type: String,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (v) => regexLink.test(v),
        message: 'поле `avatar` содержит некорректный URL',
      },
    },
  },
  { versionKey: false },
);

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .orFail()
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неправильные почта или пароль');
        }
        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
