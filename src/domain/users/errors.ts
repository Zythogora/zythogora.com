export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserError";
  }
}

export class UnknownUserError extends UserError {
  constructor() {
    super("Unknown user");
    this.name = "UnknownUserError";
  }
}

export class ReviewError extends UserError {
  constructor(message: string) {
    super(message);
    this.name = "ReviewError";
  }
}

export class UnknownReviewError extends ReviewError {
  constructor() {
    super("Unknown review");
    this.name = "UnknownReviewError";
  }
}

export class FriendError extends UserError {
  constructor(message: string) {
    super(message);
    this.name = "FriendError";
  }
}

export class UnauthorizedFriendshipStatusCallError extends FriendError {
  constructor() {
    super("Unauthorized friendship status call");
    this.name = "UnauthorizedFriendshipStatusCallError";
  }
}

export class UnauthorizedFriendRequestError extends FriendError {
  constructor() {
    super("Unauthorized friend request");
    this.name = "UnauthorizedFriendRequestError";
  }
}

export class InvalidFriendRequestError extends FriendError {
  constructor() {
    super("Invalid friend request");
    this.name = "InvalidFriendRequestError";
  }
}

export class AlreadyFriendsError extends FriendError {
  constructor() {
    super("Already friends");
    this.name = "AlreadyFriendsError";
  }
}

export class FriendRequestAcceptedError extends FriendError {
  constructor() {
    super("Friend request accepted");
    this.name = "FriendRequestAcceptedError";
  }
}

export class FriendRequestRejectedError extends FriendError {
  constructor() {
    super("Friend request rejected");
    this.name = "FriendRequestRejectedError";
  }
}

export class AlreadySentFriendRequestError extends FriendError {
  constructor() {
    super("Already sent friend request");
    this.name = "AlreadySentFriendRequestError";
  }
}

export class UnknownFriendRequestError extends FriendError {
  constructor() {
    super("Unknown friend request");
    this.name = "UnknownFriendRequestError";
  }
}

export class UnauthorizedFriendRequestApprovalError extends FriendError {
  constructor() {
    super("Unauthorized friend request approval");
    this.name = "UnauthorizedFriendRequestApprovalError";
  }
}

export class UnauthorizedFriendRequestRejectionError extends FriendError {
  constructor() {
    super("Unauthorized friend request rejection");
    this.name = "UnauthorizedFriendRequestRejectionError";
  }
}

export class UnknownFriendshipError extends FriendError {
  constructor() {
    super("Unknown friendship");
    this.name = "UnknownFriendshipError";
  }
}
