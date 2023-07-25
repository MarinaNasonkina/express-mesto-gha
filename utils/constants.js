require('dotenv').config();

const {
  NODE_ENV,
  JWT_SECRET,
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1:27017/mestodb',
} = process.env;

// eslint-disable-next-line no-useless-escape
const regexLink = /https?:\/\/(www.)?[\w\-\.]+(ru|com|net)[\w\-\.~:\/?#\[\]@!;&'\(\)*\+,;=]*/;

const CREATED_CODE = 201;

const BAD_REQUEST_ERROR = 400;
const UNAUTHORIZED_ERROR = 401;
const FORBIDDEN_ERROR = 403;
const NOT_FOUND_ERROR = 404;
const CONFLICT_ERROR = 409;

const INTERNAL_SERVER_ERROR = 500;

module.exports = {
  NODE_ENV,
  JWT_SECRET,
  PORT,
  DB_URL,
  regexLink,
  CREATED_CODE,
  BAD_REQUEST_ERROR,
  UNAUTHORIZED_ERROR,
  FORBIDDEN_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
  INTERNAL_SERVER_ERROR,
};
