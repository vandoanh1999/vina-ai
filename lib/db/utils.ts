import { generateId } from "ai";
import { hashPassword } from "@/lib/crypto/password";

export async function generateHashedPassword(password: string) {
  const hash = await hashPassword(password);
  return hash;
}

export async function generateDummyPassword() {
  const password = generateId();
  const hashedPassword = await generateHashedPassword(password);
  return hashedPassword;
}
