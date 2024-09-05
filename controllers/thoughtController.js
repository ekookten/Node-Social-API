const Thought = require('../models/Thought');
const User = require('../models/User');

module.exports = {
  // Get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.status(200).json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get thought by ID
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findById(req.params.id);
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      await User.findByIdAndUpdate(req.body.userId, { $push: { thoughts: thought._id } });
      res.status(201).json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Update thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.status(200).json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Delete thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.id);
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      await User.findByIdAndUpdate(thought.userId, { $pull: { thoughts: thought._id } });
      res.status(200).json({ message: 'Thought deleted' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add reaction to a thought
  async addReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $push: { reactions: req.body } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.status(200).json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Remove reaction from a thought
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: 'No thought found with this id!' });
      }
      res.status(200).json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },
};
