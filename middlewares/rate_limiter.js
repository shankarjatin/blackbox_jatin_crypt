var request_count = {};
var ipRequest_count = {};

const rateLimitProps = { max_req: 100, refresh_time: 60 * 1000 };
var last_reset = new Date();

const ipRateLimitProps = { max_req: 60, refresh_time: 60 * 1000 };
var last_reset_ip = new Date();

exports.rateLimiter = (req, res, next) => {
    const email = req.user.email;
    const now = new Date();
    if (now - last_reset >= rateLimitProps.refresh_time) {
        request_count = {};
        last_reset = new Date()
    }
    request_count[email] = request_count[email] ? request_count[email] + 1 : 1;
    if (request_count[email] > rateLimitProps.max_req) {
        return res.status(502).send("Server Unavailable! Please try again after few minutes")
    }
    next()
}

exports.ipRateLimiter = (req, res, next) => {
    const ip = req.ip;
    const now = new Date();
    if (now - last_reset >= ipRateLimitProps.refresh_time) {
        ipRequest_count = {};
        last_reset_ip = new Date()
    }
    ipRequest_count[ip] = ipRequest_count[ip] ? ipRequest_count[ip] + 1 : 1;
    if (ipRequest_count[ip] > ipRateLimitProps.max_req) {
        return res.status(502).send("Server Unavailable! Please try again after few minutes")
    }
    next()
}
