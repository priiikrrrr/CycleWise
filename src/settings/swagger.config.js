const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
    definition:{
        openapi : "3.1.0",
        info : {
            title : "PERIOD TRACKER API",
            version : "0.1.0",
            description : "API application made with Express and documented with Swagger",
            license : {
                name : "MIT",
                url : "https://spdx.org/licenses/MIT.html",
            },
            contact : {
                name : "Priyanka Kharwar",
                email : "priyankakharwarr@gmail.com"
            },
        },
        servers : [
            {
                url : "http://localhost:3001"
            }
        ]
    },
    apis:[path.join(__dirname,"..","**/*.js")],
};


const specs = swaggerJsdoc(options);
module.exports = specs;