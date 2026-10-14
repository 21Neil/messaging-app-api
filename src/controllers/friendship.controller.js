import * as friendshipService from '../services/friendship.service.js';

export const sentFriendship = async (req, res, next) => {
  const senderId = req.user.id;
  const receiverUsername = req.body.username;

  try {
    await friendshipService.sentFriendship({
      senderId,
      receiverUsername,
    });

    return res.status(200).json({ message: 'Send success' });
  } catch (err) {
    next(err);
  }
};
