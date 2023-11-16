const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.json());
app.use(express.static("public"));
const cors = require("cors");
app.use(cors());

const upload = multer({dest: __dirname + "/public/images" })

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});


let things = [{
        _id: 1,
        name: "Shower Head",
        description: "A shower head is a nozzle located inside of a shower that distributes water overhead the bather in order to clean them",
        inventionDate: "Invention Date: 1767",
        inventor: "Inventor: William Feetham",
        funFacts: [
            "Shower heads can have adjustable water pressure",
            "The first shower head used a hand pump",
            "The inventor of shower heads was actually a stove maker"
        ],
        img: "images/shower.png"
    },
    {
        _id: 2,
        name: "Blanket",
        description: "A blanket is a large soft cloth large enough to cover a persons body while providing them warmth and comfort",
        inventionDate: "Invention Date: 1700 BCE",
        inventor: "Inventor: Countless Civilizations",
        funFacts: [
            "Blankets have, in one way or another, existed for thousands of years",
            "The synthetic blanket, which we use today, was invented in the 1800s",
            "Early humans used large animal hides for warmth"
        ],
        img: "images/blanket.png"
    },
    {
        _id: 3,
        name: "Chair",
        description: "A chair is a seat designed for one person, typically consisting of 4 legs and a back-rest",
        inventionDate: "Invention Date: 3100 BC, Modern Chair: 1925",        
        inventor: "Inventor: Marcel Breuer",
        funFacts: [
            "Chairs have been around for thousands of years",
            "In Egyptian times, the master of the household was the only one with a chair",
            "In Europe, the Renaissance led to the chair becoming a household item instead of an item owned only by the wealthy"
        ],
        img: "images/chair.png"
    },
    {
        _id: 4,
        name: "Traffic Cone",
        description: "Traffic cones are cone shaped markers used to block off parts of roads and sidewalks during construction",
        inventionDate: "Invention Date: 1940",
        inventor: "Inventor: Charles D. Scanlon",
        funFacts: [
            "College students love to steal traffic cones",
            "Traffic cones are outfitted with a reflective material so that vehicles can view them easier at night",
            "The original traffic cone was made to return to an upright position after being knocked down"
        ],
        img: "images/cone.png"
    },
    {
        _id: 5,
        name: "Fortune Cookie",
        description: "Fortune cookies are crisp sugary cookies containing a piece of paper with a fortune written on it",
        inventionDate: "Invention Date: 1914",
        inventor: "Inventor: Makoto Hagiwara, ",
        funFacts: [
            "Fortune cookies have been around for thousands of years in Japan and China",
            "The fortune cookie that all Americans know was created in San Francisco",
            "The hit show Rick and Morty has an episode involving the fortune cookies from fortunes become real"
        ],
        img: "images/fortune.png"
    },
    {
        _id: 6,
        name: "Hourglass",
        description: "An hourglass is a device used to measure the passage of time through the use of sand flowing from the top to the bottom",
        inventionDate: "Invention Date: 8th Century AD",
        inventor: "Inventor: Liutprand",
        funFacts: [
            "The duration of time a given hourglass will last depends on the size and shape of the hourglass",
            "The hourglass was used for measuring time during ocean travel due to being unaffected by waves",
            "Ferdinand Magellan used 18 hourglasses during a trip around the globe, each turned by the ship's page in order to provide times for the ship's log"
        ],
        img: "images/hourglass.png"
    },
];

app.get("/api/things", (req, res) => {
    res.send(things);
})

app.post("/api/things", upload.single("cover"), (req,res) => {
    const result = validateThings(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const newId = things.length > 0 ? things[things.length - 1]._id + 1: 1;
    const thing = {
        _id: newId,
        name: req.body.name,
        description: req.body.description,
        inventionDate: req.body.inventionDate,
        inventor: req.body.inventor,
        funFacts: Array.isArray(req.body.funFacts) ? req.body.funFacts : req.body.funFacts.split(",")

    }

    things.push(thing);
    res.send(things);
});

const validateThings = (thing) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.allow(""),
        description: Joi.string().required(),
        inventionDate: Joi.string().required(),
        inventor: Joi.string().required(),
        funFacts: Joi.allow("")
    });
    return schema.validate(thing);
}

app.listen(3001, () => {
    console.log("listening");
});