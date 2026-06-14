import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db= mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();


const connectDB = async () =>{
    try {
        const connecton = await db.getConnection();
        console.log("MYSQL Connected");
        connecton.release();
    } catch (error) {
        console.error("Database Connection Failed");
        console.error(error.message);
        process.exit(1);
    }
};


export {connectDB};
export default db;