const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) {
    return res.json({ error: "User not logged in!" });
  }

  try {
    const validToken = verify(accessToken, process.env.SECRET_JWT);

    if (validToken) {
        console.log("here")
      return next();
    }
  } catch (error) {
    return res.json({ error: error })
  }
};


module.exports = { validateToken }
