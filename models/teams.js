const mongoose = require("mongoose");
const schema = mongoose.Schema;

const teamSchema = new schema(
  {
    team_name: {
      type: String,
      unique: true,
    },
    leader_name: {
      type: String,
      required: true,
    },
    leader_email: {
      type: String,
      unique: true,
      // validate: {
      //   validator: function (value) {
      //     return value.toLowerCase().endsWith("@akgec.ac.in");
      //   },
      //   message: (props) =>
      //     `${props.value} is not a valid email address from @akgec.ac.in`,
      // },
    },
    member_name: {
      type: String,
      default: null,
    },
    member_email: {
      type: String,
      required: false,
      default: null,
      validate: {
        validator: function (value) {
          // Check if the email domain is 'example.com'
          if (!value) {
            return true;
          }
          return value.toLowerCase().endsWith("@akgec.ac.in");
        },
        message: (props) =>
          `${props.value} is not a valid email address from @akgec.ac.in`,
      },
    },

    // below fields are for storing the team's score and game details
    level: {
      type: Number,
      default: 1,
    },
    score: {
      type: Number,
      default: 0,
    },
    blocked_message: {
      type: String,
      default: "",
    },
    attempts: [],
    submitted: {
      type: Boolean,
      default: false,
    },
    Array: {
      type: [String], // Define the field as an array of strings
      default: [], // Optional: Set a default value for the array (empty array in this case)
    },
    blackbox_level: {
      type: Number,
      default: 1,
    },
    black_points: {
      type: Number,
      default: 0,
    },
    last_submit_blackbox: {
      type: Date,
      default: Date.now(),
    },
    last_submit_crypthunt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

teamSchema.pre("save", function (next) {
  // Convert the email to lowercase
  this.leader_email = this.leader_email.toLowerCase();
  this.member_email = this.member_email.toLowerCase();
  next();
});

const Teams = new mongoose.model("Teams", teamSchema);

module.exports = Teams;
