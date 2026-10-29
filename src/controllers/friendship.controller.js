import * as friendshipService from '../services/friendship.service.js';

export const getFriendshipInvitations = async (req, res, next) => {
  const receiverId = req.user.id;

  try {
    const invitations = await friendshipService.getFriendshipInvitations({
      receiverId,
    });

    return res.status(200).json(invitations);
  } catch (err) {
    next(err);
  }
};

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

export const applyFriendship = async (req, res, next) => {
  const receiverId = req.user.id;
  const friendshipId = req.body.id;

  try {
    await friendshipService.applyFriendship({ receiverId, friendshipId });

    return res.status(200).json({ message: 'Apply success' });
  } catch (err) {
    next(err);
  }
};
