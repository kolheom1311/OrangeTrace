import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ENABLE_USER_SECRET!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function generateEnableUserLink(uid: string): string {
  const token = jwt.sign({ uid }, JWT_SECRET, { expiresIn: "1h" });
  
  const verifyLink = `${BASE_URL}/verify-email?token=${token}`;
  
  return verifyLink;

}