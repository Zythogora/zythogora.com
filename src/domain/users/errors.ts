export class UserError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnknownUserError extends UserError {
  constructor() {
    super("Unknown user");
  }
}

export class ReviewError extends UserError {
  constructor(message: string) {
    super(message);
  }
}

export class UnknownReviewError extends ReviewError {
  constructor() {
    super("Unknown review");
  }
}

export class FriendError extends UserError {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedFriendshipStatusCallError extends FriendError {
  constructor() {
    super("Unauthorized friendship status call");
  }
}

export class UnauthorizedFriendRequestError extends FriendError {
  constructor() {
    super("Unauthorized friend request");
  }
}

export class InvalidFriendRequestError extends FriendError {
  constructor() {
    super("Invalid friend request");
  }
}

export class AlreadyFriendsError extends FriendError {
  constructor() {
    super("Already friends");
  }
}

export class FriendRequestAcceptedError extends FriendError {
  constructor() {
    super("Friend request accepted");
  }
}

export class FriendRequestRejectedError extends FriendError {
  constructor() {
    super("Friend request rejected");
  }
}

export class AlreadySentFriendRequestError extends FriendError {
  constructor() {
    super("Already sent friend request");
  }
}

export class UnknownFriendRequestError extends FriendError {
  constructor() {
    super("Unknown friend request");
  }
}

export class UnauthorizedFriendRequestApprovalError extends FriendError {
  constructor() {
    super("Unauthorized friend request approval");
  }
}

export class UnauthorizedFriendRequestRejectionError extends FriendError {
  constructor() {
    super("Unauthorized friend request rejection");
  }
}

export class UnknownFriendshipError extends FriendError {
  constructor() {
    super("Unknown friendship");
  }
}
