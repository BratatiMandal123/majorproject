// init/seedListingsAll.js

const mongoose = require("mongoose");
const Listing = require("../models/listing"); // adjust path if needed
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/wanderlust", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// All your Cloudinary image URLs
const images = [
  // "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643511/wanderlust/n8mipvmled2ldxoc1fek.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643513/wanderlust/x5qyfpuucfozysqwub6g.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643513/wanderlust/wpdmcyb1iokyla7cvzly.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643514/wanderlust/inb8pch1vptiyqa6c45i.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643514/wanderlust/sip9tjypti49gnek3ujy.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643514/wanderlust/dx5dnej78bpbplv1w6b1.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643514/wanderlust/p1ryuhvjpfnogu26di8s.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643514/wanderlust/h6hfqxxzhuofw3odlzof.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643514/wanderlust/epwju4m1hrny2jkhnrx7.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643515/wanderlust/u04zyotwsliqz6uuqcj2.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643515/wanderlust/tiwyg8digghiaxhpqltr.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643515/wanderlust/masxi5wawnlrgejeqjse.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643515/wanderlust/vfexobi7y8tasfuft2j2.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643515/wanderlust/pmge4adoz06lga4ev1e5.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643515/wanderlust/dg83cclq6pi9ixjyrxxf.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643515/wanderlust/hnufteb1njddlipfkeqm.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643515/wanderlust/ykplsyp86jd2aoletk1i.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643515/wanderlust/rah3xrdvcmfxhz3nre7t.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643516/wanderlust/rugypeckz7doxwnrvpvy.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643517/wanderlust/nqu8cvyqzm2tksrob6co.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643517/wanderlust/arwzv6ic1ybiigylk6fx.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643517/wanderlust/tnwkdqtu6b4oghngkoox.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643517/wanderlust/fabyqqncxuehdcvuqche.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643518/wanderlust/vytj8qp17dnybaxs83si.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643518/wanderlust/vpnwhlyvw8du47q0sfpk.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643518/wanderlust/dtuysqa6qldait9rkara.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643519/wanderlust/mgxkcl3wumvhqktpm12y.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643519/wanderlust/yi6cxdfc7yxurk53f0om.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643520/wanderlust/om6qopcmhlyqisqf0yvn.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643521/wanderlust/oedexmpdeep4o1tqisgy.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643521/wanderlust/x97bka03vu8v8k0pior7.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643521/wanderlust/vo3tduj5hdcwisfvelof.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643521/wanderlust/tm7nvdoxpc9boju9arfa.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643521/wanderlust/uvldvfkvbotteduiaguz.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643521/wanderlust/irin7mf9vchrsrpsiv6k.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643522/wanderlust/n6xvd2md1ayaswtkeplw.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643522/wanderlust/cvxlzzdibxf3pxnivhey.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643522/wanderlust/kbbqrigvbp04csvth8m6.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643522/wanderlust/pjav3fyzpolwqendja4g.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643525/wanderlust/ce9xlkczyvjujcqaa8jh.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643525/wanderlust/no9mnp7xgsqvhvhpa549.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643525/wanderlust/up2unefzww1uywzsvrgj.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643530/wanderlust/uei3ps1jumczic3cvzrr.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643530/wanderlust/yvqp2l9solod9mtqebmf.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643531/wanderlust/sbfmuue6e0cjm6koen3o.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643532/wanderlust/gmedb66fgndfnxqajvfu.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643532/wanderlust/i86bijubdctk76hndwgk.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643532/wanderlust/ff38u1nwm1m9m6uiasjj.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643533/wanderlust/q1muxk9fet7y21pee5av.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643533/wanderlust/rcm3vdwiqdlsbz1mi6ba.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643533/wanderlust/ha2ik992juyktwouxjp1.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643533/wanderlust/vwazzw2boghnjzzznosu.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643533/wanderlust/qwjynayisbvggzvwf5uu.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643533/wanderlust/zgvoguxjlgchvlkmdzfn.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643533/wanderlust/u7ltw8szwv845kbq4igv.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643534/wanderlust/hrgftxnfleoduvk1isnv.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643535/wanderlust/os38j9djk2yimgatytb6.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643535/wanderlust/flfrft0ve5lccrygwyyx.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643535/wanderlust/w7sxyeizisjz2uijezct.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643535/wanderlust/ertko0wwybmtht8cbxm3.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643534/wanderlust/hrgftxnfleoduvk1isnv.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643535/wanderlust/os38j9djk2yimgatytb6.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643535/wanderlust/flfrft0ve5lccrygwyyx.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643535/wanderlust/w7sxyeizisjz2uijezct.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643534/wanderlust/hrgftxnfleoduvk1isnv.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643535/wanderlust/os38j9djk2yimgatytb6.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643534/wanderlust/hrgftxnfleoduvk1isnv.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643534/wanderlust/hrgftxnfleoduvk1isnv.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643535/wanderlust/os38j9djk2yimgatytb6.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643535/wanderlust/flfrft0ve5lccrygwyyx.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643535/wanderlust/w7sxyeizisjz2uijezct.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643535/wanderlust/ertko0wwybmtht8cbxm3.jpg",
  "https://res.cloudinary.com/dp00nhnxg/image/upload/v1773643536/wanderlust/nwols78f4ge541h8ruzn.jpg"
  
];

// Cities
const cities = [
  { city: "Kolkata", country: "India" },
  { city: "Mumbai", country: "India" },
  { city: "Delhi", country: "India" },
  { city: "Paris", country: "France" },
  { city: "London", country: "United Kingdom" },
  { city: "Goa", country: "India" },
  { city: "Dubai", country: "UAE" },
  { city: "Darjeeling", country: "India" },
  { city: "Puri", country: "India" }
];

// Title types
const titleTypes = ["Flat", "Home", "Hotel", "Apartment", "Villa", "Cottage", "Bungalow"];

// Seed DB
const seedDB = async () => {
  await Listing.deleteMany({});
  console.log("All old listings deleted");

  let listings = [];

  for (let i = 0; i < images.length; i++) {
    const cityObj = cities[i % cities.length]; // loop through cities if images > cities
    const titleType = titleTypes[i % titleTypes.length];
    const title = `${titleType} in ${cityObj.city}`;
    const description = `A beautiful ${title.toLowerCase()} with modern amenities, cozy environment, and perfect for travelers.`;
    const price = Math.floor(Math.random() * 8000) + 1000; // price 1000-9000
    const image = { url: images[i], filename: `listing${i}` };
    const owner = "68cce05ce14c478b59f9ea92"; // replace with valid ObjectId

    listings.push({
      title,
      description,
      image,
      price,
      location: cityObj.city,
      country: cityObj.country,
      reviews: [],
      owner,
    });
  }

  await Listing.insertMany(listings);
  console.log(`${images.length} unique listings created`);
};

seedDB().then(() => mongoose.connection.close());