const fs = require("fs");
const path = require("path");
const databasePath = path.join(__dirname, "../database.json");
async function restoresDatabase(){
    const defaultData = {
        users: [
            {
                userId: "12345",
                creditCard: {
                    number: "4002356157883832",
                    expiry: "2028-08",
                    cvv: "123"
                }
            },
            {
                userId: "67890",
                creditCard: {
                    number: "4111111111111111",
                    expiry: "2028-03",
                    cvv: "456"
                }
            }
        ]
    };

    fs.writeFileSync(databasePath, JSON.stringify(defaultData, null, 2));
    console.log("Database restored successfully.");

}

module.exports = { restoresDatabase };