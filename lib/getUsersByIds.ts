import { getUser, User } from "./user";

export async function getUsersByIds(ids: string[]): Promise<{ [id: string]: User }> {
  const result: { [id: string]: User } = {};
  await Promise.all(ids.map(async (id) => {
    const user = await getUser(id);
    if (user) result[id] = user;
  }));
  return result;
}
