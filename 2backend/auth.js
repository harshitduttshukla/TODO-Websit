import jwt from 'jsonwebtoken';

const JWT_SECRET = "harshitloveshivangi";

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  // Check if the authorization header is present and properly formatted
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: "Authorization token missing or malformed!" });
  }

  // Extract the token part from the "Bearer <token>" format
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decodedData = jwt.verify(token, JWT_SECRET);

    // Store the user ID in req for use in other middleware/routes
    req.userId = decodedData.id;

    next(); // Pass control to the next middleware or route
  } catch (err) {
    res.status(403).json({
      message: "Invalid Token!",
    });
  }
}

// Export using ES6
export { auth, JWT_SECRET };
