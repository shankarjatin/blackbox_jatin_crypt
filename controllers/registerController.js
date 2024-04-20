const Team = require("../models/teams");

//storing team name and details of leader and member
const register = async (req, res) => {
  // if (req.body.APIPin === process.env.APIKEY) {
  await Team.create({
    team_name: req.body.team_name,
    leader_name: req.body.leader_name,
    leader_email: req.body.leader_email,
    member_name: req.body.member_name,
    member_email: req.body.member_email,
  })
    .then(() => {
      return res.status(200).json({ success: true });
    })
    .catch((err) => {
      return res.status(500).json({ success: false });
      console.log(err);
    });
  // } else {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Not an authorized request",
  //   });
  // }
};

module.exports = register;
