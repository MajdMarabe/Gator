import { db } from "..";
import { users } from "../../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(name: string) {
    const existingUser = await db.select().from(users).where(eq(users.name, name));
      if (!name || name.trim() === "") {
    throw new Error("username is required");
  }
  if (existingUser.length > 0) {
    throw new Error(`User "${name}" already exists!`);
  }

  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}
export async function getUserByName(name: string) {
  const result = await db.select().from(users).where(eq(users.name, name));
  return result[0];
}
export async function resetUsers() {
  try {
    await db.delete(users).execute(); 
    return true;
  } catch (err) {
    console.error("Failed to reset users:", err);
    return false;
  }
}
export async function getUsers() {
  const allUsers = await db.select().from(users);
  return allUsers; 
}