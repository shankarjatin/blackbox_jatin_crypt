const Team = require("../models/teams");


//storing team name and details of leader and member
const register = async (req, res) => {
    await Team.create({
        team_name: req.body.team_name,
        leader_name: req.body.leader_name,
        leader_email: req.body.leader_email,
        member_name: req.body.member_name,
        member_email: req.body.member_email,
    }).then(() => { res.status(200).json({ success: true }) }).catch((err) => { res.status(500).json({ success: false }) })
}

module.exports = register;