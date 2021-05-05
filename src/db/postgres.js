const { Client } = require('pg');

const config = {
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    database: process.env.DATABASE
}

const client = new Client(config);
client.connect((err) => {
    if(err){
        console.log(err);
    }
});

client.on("connect", () => {
    console.log("connected");
})

client.on("end", () => {
    console.log("connection closed");
})

client.on("error", (error) => {
    console.log("error: ", error);
})

module.exports = {
    client
}