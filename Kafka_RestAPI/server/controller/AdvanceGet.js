const { sendMessage } = require("../producer/ProducerGet_Ad");
const redisClient = require("../Redis/redisClient");
const  Register=require("../module/student")
exports.Advanceusers = async (req, res) => {
    try {
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 5;
        let skip = (page - 1) * limit;

        const { names, countrys, lesses, equals, truess, hoobies, year } = req.query;

        const equalsValue = !isNaN(parseFloat(equals)) ? parseFloat(equals) : undefined;

        const query = {
            ...(names && { name: { $regex: names, $options: "i" } }),
            ...(countrys && { country: { $regex: countrys, $options: "i" } }),
            ...(lesses && { age: { $lt: Number(lesses) } }),
            ...(equalsValue !== undefined && { age: { $eq: equalsValue } }),
            ...(truess && { isEligible: { $eq: truess === 'true' } }),
            ...(hoobies && { hobbies: { $in: [hoobies] } }),
            ...(year && {
                date: {
                    $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                    $lte: new Date(`${year}-12-31T23:59:59.999Z`)
                }
            })
        };

        const cacheKey = `commentsData:${JSON.stringify(req.query)}`;
        const cacheTTL = 15;

        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log("Serving data from cache");
            res.set("X-Cache", "HIT");
            return res.json(JSON.parse(cachedData));
        }

        const data = await Register.find(query).skip(skip).limit(limit);
        const totalCount = await Register.countDocuments(query);

        // Send data to Kafka
        await sendMessage("UserAPI", { data, totalCount });

        await redisClient.setEx(cacheKey, cacheTTL, JSON.stringify({ data, totalCount }));

        res.set("X-Cache", "MISS");
        res.json({ data, totalCount });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ status: "Error", message: "Server Error" });
    }
};



// // const { sendMessage } = require("../producer/producer_user");
// const { sendMessage } = require("../producer/ProducerGet_Ad");
// const redisClient = require("../Redis/redisClient");
// const  Register=require("../module/student")

// exports.users = async (req, res) => {
//     try {
//         let data = await Register.find({}).limit(10); // Sample data for Kafka
        
//         // Ensure all required fields are present
//         data = data.map(user => ({
//             name: user.name || "Unknown",
//             gender: user.gender || "Unknown",
//             bio: user.bio || "N/A",
//             country: user.country || "Unknown",
//             email: user.email || "N/A",
//             bloodGroup: user.bloodGroup || "Unknown",
//             birthDate: user.birthDate || new Date().toISOString(),
//             age: user.age || 0,
//             price: user.price || 0,
//         }));

//         await sendMessage("UserAPI", data);

//         res.json({ status: "success", message: "Users sent to Kafka" });
//     } catch (error) {
//         console.error(`Error: ${error.message}`);
//         res.status(500).json({ status: "Error", message: "Server Error" });
//     }
// };
