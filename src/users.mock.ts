import { v4 } from 'uuid';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import User from "./User";

const users: User[] = [];

const generateUsers = () => {
  if (users.length === 0) {
    for (let i = 0; i < 100; ++i) {
      users.push({
        id: v4(),
        username: uniqueNamesGenerator({
          dictionaries: [adjectives, animals, colors],
          length: 2
        }),
        age: Math.floor(Math.random() * 70) + 1,
      });
    }
  }
};

export const getUsersApi = async (): Promise<{ users: User[] }> => {
  generateUsers();

  const delayPromise = (second: number) => new Promise((res) => setTimeout(res, second));
  await delayPromise(5 * 1000);

  return {
    users,
  };
};