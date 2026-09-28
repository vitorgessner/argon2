import argon2 from 'argon2';

export class Password {
    allowedSymbols = /[!#$%&*+-.=?@^_|~]/gm;
    notAllowedSymbols = /[()[\]{};:,'"<>\/\\]/gm;
    numbers = /[0-9]/gm;

    hashPassword = async (password) => {
        await this.#checkPassword(password);

        try {
            const hash = await argon2.hash(password + process.env.PEPPER);
            return hash;
        } catch (err) {
            console.error(err);
        }
    }

    verifyPassword = async (typedPassword, userPassword) => {
        try {
            if (await argon2.verify(userPassword, typedPassword + process.env.PEPPER)) {
                return true;
            }

            return false;
        } catch(err) {
            console.error(err.message);
        }
    }

    #checkPassword = async (password) => {
        if (password.length < 7 || password.length > 50) {
            throw new Error('Password length must be higher than 7 characters and less than 50 characters');
        }

        if (!this.allowedSymbols.test(password)) {
            throw new Error('Password is to weak, include at least one symbol');
        }

        if (this.notAllowedSymbols.test(password)) {
            throw new Error('Password must not contain these symbols: ' + password.match(this.notAllowedSymbols).join(' '));
        }

        if (!this.numbers.test(password)) {
            throw new Error('Password must contain at least one number');
        }
    }
}