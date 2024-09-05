const User = require('../models/ User');
const Thought = require('../models/Thought');

module.exports = {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find().populate('friends').populate('thoughts');
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id).populate('friends').populate('thoughts');
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a new user
  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Update user
  async updateUser(req, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Delete user
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.status(200).json({ message: 'User and associated thoughts deleted' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add friend
  async addFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Remove friend
  async removeFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
