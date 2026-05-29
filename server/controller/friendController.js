import Friendship from '../model/friendshipmodel.js'
import User from '../model/usermodel.js'

// Sugira abantu batari inshuti (People you may know)
export const suggestFriends = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // All users except current user
    const allUsers = await User.find({ _id: { $ne: currentUserId } }).select('-password');

    // Exclude users with accepted/rejected status
    const excludedRelations = await Friendship.find({
      $or: [
        { requester: currentUserId },
        { recipient: currentUserId }
      ],
      status: { $in: ["accepted", "rejected"] }
    });

    const excludedUserIds = excludedRelations.map(f =>
      f.requester.toString() === currentUserId.toString()
        ? f.recipient.toString()
        : f.requester.toString()
    );

    // Pending friendships from current user
    const pendingRequestsFromUser = await Friendship.find({
      requester: currentUserId,
      status: "pending"
    });
    const pendingUserIds = pendingRequestsFromUser.map(f => f.recipient.toString());

    // Incoming pending requests to current user
    const incomingPending = await Friendship.find({
      recipient: currentUserId,
      status: "pending"
    });
    const incomingUserIds = incomingPending.map(f => f.requester.toString());

    // Accepted friends of current user
    const acceptedFriendships = await Friendship.find({
      $or: [
        { requester: currentUserId },
        { recipient: currentUserId }
      ],
      status: "accepted"
    });

    const currentUserFriends = acceptedFriendships.map(f =>
      f.requester.toString() === currentUserId.toString()
        ? f.recipient.toString()
        : f.requester.toString()
    );

    // Final suggestions with mutual friends
    const suggestions = await Promise.all(
      allUsers
        .filter(user =>
          !excludedUserIds.includes(user._id.toString()) &&
          !incomingUserIds.includes(user._id.toString())
        )
        .map(async user => {
          // Accepted friendships for suggested user
          const userFriendships = await Friendship.find({
            $or: [
              { requester: user._id },
              { recipient: user._id }
            ],
            status: "accepted"
          });

          const userFriends = userFriendships.map(f =>
            f.requester.toString() === user._id.toString()
              ? f.recipient.toString()
              : f.requester.toString()
          );

          // Count mutual friends (intersection)
          const mutualCount = userFriends.filter(fid =>
            currentUserFriends.includes(fid)
          ).length;

          return {
            ...user.toObject(),
            hasPendingRequest: pendingUserIds.includes(user._id.toString()),
            mutualFriends: mutualCount
          };
        })
    );

    res.json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




// Send friend request
export const sendFriendRequest = async (req, res) => {
  const { recipientId } = req.body
  const requesterId = req.user._id

  try {
    const existing = await Friendship.findOne({
      requester: requesterId,
      recipient: recipientId
    })

    if (existing) return res.status(400).json({ message: "Request already sent" })

    const newRequest = new Friendship({ requester: requesterId, recipient: recipientId })
    await newRequest.save()
    res.json({ message: "Request sent" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const getFriendRequests = async (req, res) => {
  const userId = req.user._id;
  try {
    // Banza ubone aba bagusabye ubucuti
    const requests = await Friendship.find({ recipient: userId, status: 'pending' })
      .populate('requester', 'fullname profilepic');

    // Fungura buri requester urebe mutual friends
    const requestsWithMutuals = await Promise.all(
      requests.map(async (request) => {
        const requesterId = request.requester._id;

        // Inshuti z'uwakiriye (userId)
        const myFriends = await Friendship.find({
          $or: [
            { requester: userId, status: 'accepted' },
            { recipient: userId, status: 'accepted' }
          ]
        });

        const myFriendIds = myFriends.map(f =>
          f.requester.toString() === userId.toString() ? f.recipient.toString() : f.requester.toString()
        );

        // Inshuti za requester
        const requesterFriends = await Friendship.find({
          $or: [
            { requester: requesterId, status: 'accepted' },
            { recipient: requesterId, status: 'accepted' }
          ]
        });

        const requesterFriendIds = requesterFriends.map(f =>
          f.requester.toString() === requesterId.toString() ? f.recipient.toString() : f.requester.toString()
        );

        // Guhuza: mutual friends
        const mutualFriendsCount = myFriendIds.filter(id => requesterFriendIds.includes(id)).length;

        return {
          _id: request._id,
          requester: request.requester,
          mutualFriends: mutualFriendsCount,
          createdAt: request.createdAt,
        };
      })
    );

    res.json(requestsWithMutuals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getofficialfriends = async (req, res) => {
  const userId = req.user._id;
  try {
    // Banza ubone aba bagusabye ubucuti
    const requests = await Friendship.find({ $or :[{recipient: userId},{requester:userId}],
                                                status: 'accepted' })
                                                .populate('requester', 'fullname profilepic')
                                                .populate('recipient', 'fullname profilepic');

    // Fungura buri requester urebe mutual friends
    const requestsWithMutuals = await Promise.all(
      requests.map(async (request) => {
        const friendUser = request.requester._id.toString() === userId.toString()
          ? request.recipient
          : request.requester;
        const requesterId = friendUser._id;

        // Inshuti z'uwakiriye (userId)
        const myFriends = await Friendship.find({
          $or: [
            { requester: userId, status: 'accepted' },
            { recipient: userId, status: 'accepted' }
          ]
        });

        const myFriendIds = myFriends.map(f =>
          f.requester.toString() === userId.toString() ? f.recipient.toString() : f.requester.toString()
        );

        // Inshuti za requester
        const requesterFriends = await Friendship.find({
          $or: [
            { requester: requesterId, status: 'accepted' },
            { recipient: requesterId, status: 'accepted' }
          ]
        });

        const requesterFriendIds = requesterFriends.map(f =>
          f.requester.toString() === requesterId.toString() ? f.recipient.toString() : f.requester.toString()
        );

        // Guhuza: mutual friends
        const mutualFriendsCount = myFriendIds.filter(id => requesterFriendIds.includes(id)).length;

        return {
          _id: request._id,
          requester: friendUser,
          status: request.status,
          mutualFriends: mutualFriendsCount
        };
      })
    );

    res.json(requestsWithMutuals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Accept friend request
export const acceptFriend = async (req, res) => {
  const { requestId } = req.body
  try {
    await Friendship.findByIdAndUpdate(requestId, { status: 'accepted' })
    res.json({ message: "Friend request accepted" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// Reject or Delete
export const rejectFriend = async (req, res) => {
  const { requestId } = req.body
  try {
    await Friendship.findByIdAndDelete(requestId)
    res.json({ message: "Friend request rejected/deleted" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}
