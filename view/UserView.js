import { select, input, password } from "@inquirer/prompts";

export class UserView {
  showInterface = async () => {
        const option = await select({
          message: "Select an action",
          choices: [
            {
              name: "Register",
              value: "register",
            },
            {
              name: "Login",
              value: "login",
            },
            {
              name: "Exit",
              value: "exit",
            },
          ],
        });

    return option;
  };

  showUserInterface = async () => {
    const username = await input({ message: 'type your username', });
    const userPassword = await password({ message: 'type your password', mask: '*', });

    return { username, password: userPassword };
  }
}
