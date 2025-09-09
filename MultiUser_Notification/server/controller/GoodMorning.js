const { sendMessage, initProducer } = require("../producer/producer");

exports.Good_Morn = async (req, res) => { 
    try {
        const updateGreeting = async () => {
            setTimeout(async () => {
                const now = new Date();
                const hours = now.getHours();
                let greeting = "";

                // Always Good Morning (kept your if/else style)
                if (hours < 12) {
                    greeting = "🌞 Good Morning!";
                } else {
                    greeting = "🌞 Good Morning!";
                }

                // Example payload
                const user = { 
                    name: "Guest", 
                    message: greeting,  
                    timestamp: now.toISOString()   // ✅ ISO timestamp
                };
                // ✅ Await sendMessage (if implemented in your project)
                await sendMessage("Notification", user);

                // Send to kafka asynchronously (fire-and-forget, but log errors)
    sendMessage("NotificationQueue", user).catch(err => {
      console.error("Failed to send Kafka message:", err);
    });
                // Send response with timestamp
                res.json({ 
                    message: greeting, 
                    timestamp: now.toISOString()  // ISO timestamp
                });
            }, 2000);
        };

        // Call the function once
        updateGreeting();
    } catch (error) {
        console.error("Error in Good_Morn:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};


 initProducer()