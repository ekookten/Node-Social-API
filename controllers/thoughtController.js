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
    const { thoughtId } = req.params;
    const updateData = req.body;

    // Ensure there is something to update
    if (!Object.keys(updateData).length) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    const thought = await Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $set: updateData },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought found with that ID' });
    }

    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
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
