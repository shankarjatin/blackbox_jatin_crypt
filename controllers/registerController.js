const Team = require("../models/teams");

//storing team name and details of leader and member
const register = async (req, res) => {
  const query = [
    { team_name: req.body.team_name },
    { leader_email: req.body.leader_email },
    { member_email: req.body.leader_email },
  ];
  if (req.body.member_email) {
    query.push({ member_email: req.body.member_email });
    query.push({ leader_email: req.body.member_email });
  }
  const existing_team = await Team.findOne({
    $or: query,
  });
  if (existing_team) {
    return res.render("register", {
      message: "Team Already Exist",
    });
  }
  // if (req.body.APIPin === process.env.APIKEY) {
  await Team.create({
    team_name: req.body.team_name,
    leader_name: req.body.leader_name,
    leader_email: req.body.leader_email,
    member_name: req.body.member_name ?? "",
    member_email: req.body.member_email ?? "",
  })
    .then(() => {
      // return res.status(200).json({ success: true });
      return res.render("register", {
        message: "Registration Successful",
      });
    })
    .catch((err) => {
      // return res.status(500).json({ success: false });
      return res.render("register", {
        message: "Registration Failed",
      });
    });
  // } else {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Not an authorized request",
  //   });
  // }
};

module.exports = register;
