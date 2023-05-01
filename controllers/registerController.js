const Team = require("../models/teams");

const register = async (req, res) => {
    await Team.create({
        team_name: req.body.team_name,
        password: req.body.password,
        leader_name: req.body.leader_name,
        leader_email: req.body.leader_email,
        leader_hosteler: req.body.leader_hosteler,
        leader_year: req.body.leader_year,
        leader_branch: req.body.leader_branch,
        leader_rollNo: req.body.leader_rollNo,
        leader_phoneNo: req.body.leader_phoneNo,
        member_name: req.body.member_name,
        member_phoneNo: req.body.member_phoneNo,
        member_branch: req.body.member_branch,
        member_email: req.body.member_email,
        member_rollNo: req.body.member_rollNo,
        member_hosteler: req.body.member_hosteler,
        member_year: req.body.member_year,
        leaderIsVerified: req.body.leaderIsVerified,
        memberIsVerified: req.body.memberIsVerified,
    })
}

module.exports = register;