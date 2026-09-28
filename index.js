import { UserController } from "./controller/UserController.js";
import { UserView } from "./view/UserView.js";

const userView = new UserView();
const action = await userView.showInterface();

const userController = new UserController(userView);
userController.setContext(action);