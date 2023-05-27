var request_count = {};

const rateLimitProps = { max_req: 100, refresh_time: 60 * 1000 };
var last_reset = new Date();

exports.rateLimiter = (req, res, next) => {
    const email = req.user.email;
    const now = new Date();
    if (now - last_reset >= rateLimitProps.refresh_time) {
        request_count = {};
        last_reset = new Date()
    }
    request_count[email] = request_count[email] ? request_count[email] + 1 : 1;
    if (request_count[email] > rateLimitProps.max_req) {
        return res.send("Server Unavailable! Please try again after few minutes")
    }
    next()
}
