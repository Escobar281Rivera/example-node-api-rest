import { DataSource } from "typeorm";



export const AppDataSource = new DataSource({
    type: "mysql",
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'password',
    database: 'crud-api',
    synchronize: true,
    logging: true,
    entities: ["dist/models/**/*.js"],
    subscribers: ["dist/subscribers/**/*.js"],
    migrations: ["dist/ migrations/**/*.js"],
})