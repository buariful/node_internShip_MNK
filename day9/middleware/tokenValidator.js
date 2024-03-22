const JWTService = require("../services/JwtService");

const tokenValidator = async (req, res, next) => {
  try {
    const token = JWTService.getToken(req);

    if (!token) {
      return res.status(401).json({
        error: true,
        message: "TOKEN_EXPIRED",
        code: "TOKEN_EXPIRED",
      });
    }

    const verifyToken_result = JWTService.verifyAccessToken(token);
    if (!verifyToken_result) {
      return res.status(401).json({
        error: true,
        message: "TOKEN_EXPIRED",
        code: "TOKEN_EXPIRED",
      });
    }
    console.log("dddd");
    ///api/v1/<portal>/something
    const portal = req.params.portal;

    if (
      portal &&
      portal?.toLowerCase() !== verifyToken_result?.role?.toLowerCase()
    ) {
      return res.status(401).json({
        error: true,
        message: "Unauthorize",
      });
    }

    req.user_id = verifyToken_result?.id;
    req.role = verifyToken_result?.role;
    // res.status(200).json({
    //   portal,
    //   verifyToken_result,
    // });
    next();
  } catch (error) {}
};

module.exports = tokenValidator;
