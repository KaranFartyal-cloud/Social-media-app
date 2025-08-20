import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookie.token;
    if (!token) {
      res.status(401).json({
        success: false,
        message: "user is not authenticated",
      });
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      res.status(401).json({
        success: false,
        message: "INVALID",
      });
    }

    req.id = decode.id;
    next();
  } catch (error) {
    console.log(error);
  }
};
