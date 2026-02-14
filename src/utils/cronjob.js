const { subDays, startOfDay, endOfDay } = require("date-fns");
const cron = require("node-cron");
const connectionRequest = require("../models/connectionRequest");
const sendEmail = require("../utils/sendEmail");

cron.schedule("19 21 * * *", async () =>{

    const yesterday = subDays(new Date(),1);

    const yesterdayStart = startOfDay(yesterday);
    const yestedayEnd = endOfDay(yesterday);

    const pendingRequests = await connectionRequest.find({
        status: "interested",
        createdAt:{
            $gte : yesterdayStart,
            $lt : yestedayEnd,
        }
    }).populate("fromUserId, toUserId");

    console.log(pendingRequests);

    const listOfEmails = [...new Set(pendingRequests.map(res => res.toUserId.emaidId))];

    for(const email of listOfEmails){
        try{
            const res = await sendEmail.run(
                "New Friend Request pending for " + email,
                "there are so many friend request pending , please login and check"
            )
            console.log(res);
        }
            catch(err){
                console.error(err);
            }
        
    }
})