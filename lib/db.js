import { connect } from "mongoose";

export const connectDB = async () => {
 try {
  const resp = await connect(process.env.MONGO_URI);
  console.log(`DB connected: ${resp.connection.host}`);
 } catch (error) {
  console.log("DB connection error", error);
 }
};
