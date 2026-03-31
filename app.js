if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const cron = require('node-cron');
const expirePendingBookings = require('./cron/expireBookings');

const express= require("express");
const app=express();
const mongoose= require("mongoose"); 
const path = require("path");
const methodOverride=require("method-override");
const ejsMate =require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRoutes = require("./routes/bookings");
const wishlistRoutes = require("./routes/wishlist");
const adminRoutes = require("./routes/admin");



const dbUrl = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    crypto: {
        secret: process.env.SECRET,
    }
});

store.on("error",()=>{
    console.log("ERROE in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// app.get("/",(req,res)=>{
//     res.send("Hi! i am a root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.locals.mapToken = process.env.GOOGLE_MAP_KEY;

app.use("/wishlist", wishlistRoutes);
app.use("/bookings", bookingRoutes);


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/admin", adminRoutes);



app.all("*name",(req , res, next) => {
    next(new ExpressError(404 , "Page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "Something went wrong!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs" ,{ message });
});

cron.schedule('* * * * *', () => { // runs every minute
    expirePendingBookings();
});

app.listen(8080,()=>{
    console.log("app is listening to port 8080");
})