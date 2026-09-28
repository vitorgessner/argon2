import { Password } from "./Password.js";
import fs from "node:fs/promises";

export class User {
  username;
  #passwordModel;
  password;
  constructor() {
    this.#passwordModel = new Password();
  }

  saveUser = async (username, password) => {
    await this.#checkUsername(username, password);
    const hashedPassword = await this.#hashPassword(password);

    try {
      const users = await this.#getAllUsers();
      const user = await this.#checkIfUserExists(username);

      if (user) {
        throw new Error("Username already in use");
      }

      const newUsers = [
        ...users,
        { username: username, password: hashedPassword },
      ];

      await fs.writeFile("./data/users.json", JSON.stringify(newUsers));
      console.log("user registered with success");
    } catch (err) {
      if (err.code === "ENOENT") {
        return await this.#createDirAndSaveFirstUser(
          username,
          hashedPassword,
        );
      }

      throw err;
    }
  };

  login = async (username, typedPassword) => {
    const user = await this.#checkIfUserExists(username);

    if (!user) {
      throw new Error("Username or password is wrong");
    }

    try {
      if (
        await this.#passwordModel.verifyPassword(typedPassword, user.password)
      ) {
        return console.log("logged successfully");
      } else {
        throw new Error("Username or password is wrong");
      }
    } catch (err) {
      throw err;
    }
  };

  #checkUsername = async (username, password) => {
    if (!username || !password) {
      throw new Error("Username or password are missing");
    }

    if (username.length < 3 || username.length > 50) {
      throw new Error(
        "Username length must be higher than 3 characters and less than 50 characters",
      );
    }
  };

  #getAllUsers = async () => {
    return JSON.parse(await fs.readFile("./data/users.json"));
  };

  #hashPassword = async (password) => {
    return await this.#passwordModel.hashPassword(password);
  };

  #checkIfUserExists = async (username) => {
    const users = await this.#getAllUsers();
    const userExists = users.find((user) => user.username === username);

    return userExists;
  };

  #createDirAndSaveFirstUser = async (username, hashedPassword) => {
    await fs.mkdir("./data");
    await fs.writeFile(
      "./data/users.json",
      JSON.stringify([
        {
          username: username,
          password: hashedPassword,
        },
      ]),
    );
    console.log("Created file and saved user with success");
  };
}
