const fs = require("fs");
const path = require("path");
const cors = require("cors");
const{StatusCodes} = require("http-status-codes");
const morgan = require("morgan");
const responseFormatter = require("../middleware/responseFormatter.middleware.js");
const baseRouter = require("../base/base.router.js");
const userRouter = require("../user/user.router.js");
const authRouter = require("../auth/auth.router.js");
const chatRouter = require("../chat/chat.router.js")
const feedRouter = require("../feed/feed.router.js");
const cycleRouter = require("../cycle/cycle.router.js");
const moodRouter = require("../mood/mood.router.js");
// const chatbotRouter = require("../chatbot/chatbot.router.js");
const expressWinstonLogger = require("../middleware/expressWinston.middleware.js");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger.config.js");

function configureApp(app){
    app.use(cors()); 
    
    let accessLogStream = fs.createWriteStream(
        path.join(__dirname, "..","access.log"),
        {
            flags: "a", 
        }
    );
    app.use(morgan("combined",{stream:accessLogStream}));
    app.use(responseFormatter);
    app.use(expressWinstonLogger);

    /*define routes */
    app.use("/"        , baseRouter);
    app.use("/user"    , userRouter);
    app.use("/auth"    , authRouter); 
    app.use("/chat"    , chatRouter); 
    app.use("/feed"    , feedRouter);
    app.use("/cycle"   , cycleRouter);
    app.use("/mood"    , moodRouter);
    // app.use("/chatbot" , chatbotRouter); 

    app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpecs));
    
    /**when the route doesnt exists i.e 404 err */
    app.use((req,res)=>{
        res.status(StatusCodes.NOT_FOUND).json(null);
    })
};


module.exports = configureApp;