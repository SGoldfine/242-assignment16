const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let things = [{
        _id: 1,
        name: "Shower Head",
        inventor: "William Feetham",
        inventionDate: "1767",
        description: "A shower head is a nozzle located inside of a shower that distributes water overhead the bather in order to clean them",
        img: "images/shower.png",
        rating: 4,
        funFacts: [
            "Shower heads can have adjustable water pressure",
            "The first shower head used a hand pump",
            "The inventor of shower heads was actually a stove maker",
        ],
    },
    {
        _id: 2,
        name: "Blanket",
        inventor: "Countless Civilizations",
        inventionDate: "1700 BCE",
        description: "A blanket is a large soft cloth large enough to cover a persons body while providing them warmth and comfort",
        img: 'images/blanket.png',
        funFacts: [
            "Blankets have, in one way or another, existed for thousands of years",
            "The synthetic blanket, which we use today, was invented in the 1800s",
            "Early humans used large animal hides for warmth",
        ],
    },
    {
        _id: 3,
        name: "Chair",
        inventor: "Marcel Breuer",
        inventionDate: "3100 BC, Modern Chair: 1925",
        description: "A chair is a seat designed for one person, typically consisting of 4 legs and a back-rest",
        img: 'images/chair.png',
        funFacts: [
            "Chairs have been around for thousands of years",
            "In Egyptian times, the master of the household was the only one with a chair",
            "In Europe, the Renaissance led to the chair becoming a household item instead of an item owned only by the wealthy",
        ],
    },
    {
        _id: 4,
        name: "Traffic Cone",
        inventor: "Charles D. Scanlon",
        inventionDate: "1940",
        description: "Traffic cones are cone shaped markers used to block off parts of roads and sidewalks during construction",
        img: 'images/cone.png',
        funFacts: [
            "College students love to steal traffic cones",
            "Traffic cones are outfitted with a reflective material so that vehicles can view them easier at night",
            "The original traffic cone was made to return to an upright position after being knocked down",
        ],
    },
    {
        _id: 5,
        name: "Fortune Cookie",
        inventor: "Makoto Hagiwara",
        inventionDate: "1914",
        description: "Fortune cookies are crisp sugary cookies containing a piece of paper with a fortune written on it",
        img: 'images/fortune.png',
        funFacts: [
            "Fortune cookies have been around for thousands of years in Japan and China",
            "The fortune cookies that all Americans know and love were created in San Francisco",
            "The hit show Rick and Morty has an episode involving the fortunes from fortune cookies becoming real",
        ],
    },
    {
        _id: 6,
        name: "Hourglass",
        inventor: "Liutprand",
        inventionDate: "8th Century AD",
        description: "An hourglass is a device used to measure the passage of time through the use of sand flowing from the top to the bottom",
        img: 'images/hourglass.png',
        funFacts: [
            "The duration of time a given hourglass will last depends on the size and shape of the hourglass",
            "The hourglass was used for measuring time during ocean travel due to being unaffected by waves",
            "Ferdinand Magellan used 18 hourglasses during a trip around the globe, each turned by the ship's page in order to provide times for the ship's log",
        ],
    },
];

app.get("/api/things", (req, res) => {
    res.send(things);
});

app.post("/api/things", upload.single("img"), (req, res) => {
    const result = validateThing(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const thing = {
        _id: things.length + 1,
        name: req.body.name,
        inventor: req.body.inventor,
        inventionDate: req.body.inventionDate,
        description: req.body.description,
        funFacts: req.body.funFacts.split(",")
    }

    if (req.file) {
        thing.img = "images/" + req.file.filename;
    }

    things.push(thing);
    res.send(things);
});

app.put("/api/things/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const thing = things.find((r) => r._id === id);;

    const result = validateThing(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    thing.name = req.body.name;
    thing.inventor = req.body.inventor;
    thing.inventionDate = req.body.inventionDate;
    thing.description = req.body.description;
    thing.funFacts = req.body.funFacts.split(",");

    if (req.file) {
        thing.img = "images/" + req.file.filename;
    }

    res.send(thing);
});

app.delete("/api/things/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const thing = things.find((t) => t._id === id);

    if (!thing) {
        res.status(404).send("The thing was not found");
        return;
    }

    const index = things.indexOf(thing);
    things.splice(index, 1);
    res.send(thing);

});

const validateThing = (thing) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        funFacts: Joi.allow(""),
        name: Joi.string().min(3).required(),
        description: Joi.string().min(3).required(),
        inventor: Joi.string().min(3).required(),
        inventionDate: Joi.string().required()
    });

    return schema.validate(thing);
};

app.listen(3000, () => {
    console.log("I'm listening");
});