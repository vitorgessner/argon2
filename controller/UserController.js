import { User } from "../model/User.js";

export class UserController {
  lastLoginAttempt;
  constructor(userView) {
    this.userView = userView;
    this.loginAttempts = 0;
    this.maxLoginAttempts = 3;
    this.totalAttemptsReached = 0;
    this.loginRateLimit = 2000;
  }

  setContext = async (action) => {
    if (action === "exit") {
      return process.exit(0);
    }

    if (action === "register") {
      const data = await this.userView.showUserInterface();
      if (this.#userWannaLeave(data.username)) {
        return await this.#showInterface();
      }
      await this.#register(data.username, data.password);
    }

    if (action === "login") {
      const data = await this.userView.showUserInterface();
      if (this.#userWannaLeave(data.username)) {
        return await this.#showInterface();
      }
      await this.#login(data.username, data.password);
    }

    await this.#showInterface();
  };

  #register = async (username, password) => {
    try {
      const userModel = new User();
      await userModel.saveUser(username, password);
    } catch (err) {
      console.error(err.message);
      await this.#showInterface("register");
    }
  };

  #login = async (username, password) => {
    try {
      if (this.loginAttempts >= this.maxLoginAttempts) {
        this.#warnForTooManyAttempts();
      }

      if (this.#passedRateLimit()) {
        throw new Error("You should wait more before trying logging in again");
      }
      this.lastLoginAttempt = Date.now();

      const userModel = new User();
      await userModel.login(username, password);
    } catch (err) {
      this.loginAttempts++;
      console.error(err.message);
      await this.#showInterface('login');
    }
  };

  #warnForTooManyAttempts = () => {
    ++this.totalAttemptsReached;
    setTimeout(
      () => (this.loginAttempts = 0),
      1000 * 30 * this.totalAttemptsReached,
    );
    throw new Error("To many attempts, try again later");
  };

  #passedRateLimit = () => Date.now() - this.lastLoginAttempt < this.loginRateLimit;

  #userWannaLeave = (username) => username === "exit"

  #showInterface = async (context = null) => {
    if (context) {
        return await this.setContext(context);
    }
    const newAction = await this.userView.showInterface();
    await this.setContext(newAction);
  }
}
