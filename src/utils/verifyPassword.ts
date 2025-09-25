import bcrypt from "bcrypt";

const verifyPassword = (password: string, passwordHash: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, passwordHash, (err, result) => {
        if (err) {
            reject(err);
        }
        resolve(result);
        });
    });
}

export default verifyPassword;