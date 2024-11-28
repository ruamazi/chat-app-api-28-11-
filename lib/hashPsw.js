import bcrypt from "bcryptjs";

export const hashPsw = async (psw) => {
 const salt = await bcrypt.genSalt(10);
 const hashedPsw = await bcrypt.hash(psw, salt);
 return hashedPsw;
};
