const User = require("./../models/user.js");

exports.blackbox = async (req, res) => {
    await User.aggregate([{
        $sort: { blackbox_level: -1 }
    }, {
        $project: {
            _id: 0,
            email: 1,
            blackbox_level: 1,
            score: 1,
            level: 1,
        }
    },
    {
        $lookup: {
            from: "teams",
            localField: "email",
            foreignField: "leader_email",
            as: "team_name"
        }
    },
    {
        $unwind: "$team_name"
    }, {
        $addFields: {
            team: "$team_name.team_name"
        }
    }, {
        $project: {
            _id: 0,
            email: 1,
            blackbox_level: 1,
            score: 1,
            level: 1,
            team: 1
        }
    }]).then((result) => {
        /*
         * Below code is for calculating rank from sorted
         * players data fetched from database
         *  --> Players on equal level will have equal ranks.
         */
        var rank = 0
        var current_rank = 0
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
        })
        res.json({ result })
    }
    ).catch(err => {
        res.json({ message: "Some error occured in fetching leaderboard" });
    })

}

exports.crypthunt = async (req, res) => {
    await User.aggregate([{
        $sort: { level: -1 }
    }, {
        $project: {
            _id: 0,
            email: 1,
            blackbox_level: 1,
            score: 1,
            level: 1,
        }
    },
    {
        $lookup: {
            from: "teams",
            localField: "email",
            foreignField: "leader_email",
            as: "team_name"
        }
    },
    {
        $unwind: "$team_name"
    }, {
        $addFields: {
            team: "$team_name.team_name"
        }
    }, {
        $project: {
            _id: 0,
            email: 1,
            blackbox_level: 1,
            score: 1,
            level: 1,
            team: 1
        }
    }]).then((result) => {
        /*
         * Below code is for calculating rank from sorted
         * players data fetched from database
         *  --> Players on equal level will have equal ranks.
         */
        var rank = 0
        var current_rank = 0
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
        })
        res.json({ result })
    }
    ).catch(err => {
        res.json({ message: "Some error occured in fetching leaderboard" });
    })

}

exports.original = async (req, res) => {
    await User.aggregate([{
        $sort: { score: -1 }
    }, {
        $project: {
            _id: 0,
            email: 1,
            blackbox_level: 1,
            score: 1,
            level: 1,
        }
    },
    {
        $lookup: {
            from: "teams",
            localField: "email",
            foreignField: "leader_email",
            as: "team_name"
        }
    },
    {
        $unwind: "$team_name"
    }, {
        $addFields: {
            team: "$team_name.team_name"
        }
    }, {
        $project: {
            _id: 0,
            email: 1,
            blackbox_level: 1,
            score: 1,
            level: 1,
            team: 1
        }
    }]).then((result) => {
        /*
         * Below code is for calculating rank from sorted
         * players data fetched from database
         *  --> Players on equal level will have equal ranks.
         */
        var rank = 0
        var current_rank = 0
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
        })
        res.json({ result })
    }
    ).catch(err => {
        res.json({ message: "Some error occured in fetching leaderboard" });
    })

}