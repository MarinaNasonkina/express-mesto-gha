const router = require('express').Router();

const {
  getMe,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const {
  validateUserId,
  validateUserInfo,
  validateAvatar,
} = require('../middlewares/validation-joi');

router.get('/me', getMe);

router.get('/', getUsers);

router.get('/:userId', validateUserId, getUserById);

router.patch('/me', validateUserInfo, updateProfile);

router.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = router;
