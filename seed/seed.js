const mongoose = require("mongoose");
const db = require("../config/db");
const { User, Thought } = require("../models");

// Sample data

const users = [
  {
    username: "Ava",
    email: "ava@gmail.com",
  },
  {
    username: "Liam",
    email: "liam@gmail.com",
  },
  {
    username: "Sophia",
    email: "sophia@gmail.com",
  },
  {
    username: "Noah",
    email: "noah@gmail.com",
  },
  {
    username: "Olivia",
    email: "olivia@gmail.com",
  },
];

const thoughts = [
  {
    thoughtText:
      "Just completed a challenging coding project, feeling accomplished!",
    username: "Ava",
  },
  {
    thoughtText:
      "Spent the day debugging a tricky issue, finally found the solution!",
    username: "Liam",
  },
  {
    thoughtText: "Learning a new programming language is always exciting!",
    username: "Sophia",
  },
  {
    thoughtText:
      "Just started a new course on machine learning, can’t wait to dive in!",
    username: "Noah",
  },
  {
    thoughtText: "Integrating APIs into my project has been so rewarding.",
    username: "Olivia",
  },
];

// Function to seed the database
async function seedDatabase() {
  try {
    await db.once("open", async () => {
      console.log("Connected to the database");

      // Clear the existing data
      await User.deleteMany({});
      await Thought.deleteMany({});

      // Insert users
      const createdUsers = await User.insertMany(users);
      console.log("Users seeded!");

      // Insert thoughts and associate them with users
      for (const thought of thoughts) {
        const user = createdUsers.find(
          (user) => user.username === thought.username
        );
        const newThought = await Thought.create({
          ...thought,
          userId: user._id,
        });
        await User.findByIdAndUpdate(user._id, {
          $push: { thoughts: newThought._id },
        });
      }

      console.log("Thoughts seeded!");

      // Close the connection
      mongoose.connection.close();
      console.log("Database seeding complete!");
    });
  } catch (error) {
    console.error("Error seeding the database:", error);
    mongoose.connection.close();
  }
}

seedDatabase();
