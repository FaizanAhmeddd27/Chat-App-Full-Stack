import jwt from 'jsonwebtoken';

const generateToken = (userId, res) => {

  const token = jwt.sign({ userId: userId}, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
     httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });

  return token;
};

export default generateToken;
 