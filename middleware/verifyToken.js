import jwt from "jsonwebtoken";


// Modify verifyToken middleware to check Authorization header
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(' ')[1];
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { _id: decoded.id };
      next();
  } catch (error) {
      console.log("Error in verifyToken middleware:", error);
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
  }
};

export const protect = async (req, res, next) => {
    try {
      let token;
  
      // Get token from Authorization header
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }
  
      if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
      }
  
      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');
        next();
      } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Not authorized, token failed' });
      }
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Not authorized' });
    }
  };