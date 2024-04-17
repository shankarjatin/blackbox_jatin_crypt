const User = require("./../models/user.js");
const Team = require("./../models/teams.js");

exports.blackbox = async (req, res) => {
  Team.find({})
    .lean()
    .sort({
      blackbox_level: -1,
      last_submit_blackbox: 1,
    })
    .select("team_name blackbox_level -_id")
    .exec(function (err, result) {
      if (err) {
        res.json({ message: "Some error occured in fetching leaderboard" });
      } else {
        /*
         * Below code is for calculating rank from sorted
         * players data fetched from database
         *  --> Players on equal level will have equal ranks.
         */
        var rank = 0;
        var current_rank = 0;
        var blackbox_level = 100;
        result.forEach((person, index) => {
          rank += 1;
          if (person.blackbox_level != blackbox_level) {
            result[index].rank = rank;
            current_rank = rank;
          } else {
            result[index].rank = current_rank;
          }
          blackbox_level = person.blackbox_level;
        });
        res.json({ result });
      }
    });
};

exports.crypthunt = async (req, res) => {
  Team.find({})
    .lean()
    .sort({
      level: -1,
      last_submit_crypthunt: 1,
    })
    .select("team_name level -_id")
    .exec(function (err, result) {
      if (err) {
        res.json({ message: "Some error occured in fetching leaderboard" });
      } else {
        /*
         * Below code is for calculating rank from sorted
         * players data fetched from database
         *  --> Players on equal level will have equal ranks.
         */
        var rank = 0;
        var current_rank = 0;
        var level = 100;
        result.forEach((person, index) => {
          rank += 1;
          if (person.level != level) {
            result[index].rank = rank;
            current_rank = rank;
          } else {
            result[index].rank = current_rank;
          }
          level = person.level;
        });
        res.json({ result });
      }
    });
};

exports.original = async (req, res) => {
  Team.find({})
    .lean()
    .sort({ score: -1, last_submit_crypthunt: 1, last_submit_blackbox: 1 })
    .select("team_name score -_id")
    .exec(function (err, result) {
      if (err) {
        res.json({ message: "Some error occured in fetching leaderboard" });
      } else {
        /*
         * Below code is for calculating rank from sorted
         * players data fetched from database
         *  --> Players on equal level will have equal ranks.
         */
        var rank = 0;
        var current_rank = 0;
        var score = 100;
        result.forEach((person, index) => {
          rank += 1;
          if (person.score != score) {
            result[index].rank = rank;
            current_rank = rank;
          } else {
            result[index].rank = current_rank;
          }
          score = person.score;
        });

        res.json({ result });
      }
    });
};
