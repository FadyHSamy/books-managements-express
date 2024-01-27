import jwt, { JwtPayload } from "jsonwebtoken";
// const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateSecretKey = () => {
  return "b97dcedb2f6ea252b54ab3bb7c712d3007c0d219b43fa80d9cad33540c8ae438";
  // crypto.randomBytes(32).toString("hex");
};

export const generateToken = (payload: any): string => {
  const secretKey = generateSecretKey();
  const expiresIn = "1h";
  const token = jwt.sign(payload, secretKey, { expiresIn });
  return token;
};

export const verifyToken = async (token: string): Promise<any> => {
  return jwt.verify(token, generateSecretKey());
};
