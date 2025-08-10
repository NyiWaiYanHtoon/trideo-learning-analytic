import { getUser } from "./get-user";

export async function produceToKafka(topic: "video-visit" | "video-view" | "video-complete", videoId: string){
    try {
      const user= await getUser();
      if(!user) return console.log("can't get user");
      const res= await fetch(`${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/kafka/produce`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic,
          data: {
            videoId: videoId,
            userId: user?.dbUser.id,
          },
        }),
      });
      if(!res.ok) return console.log(res.status, "error producing kafka topic");
      console.log("prodecuced topic: ", topic);
    } catch (err) {
      console.error("Failed to send Kafka visit event", err);
    }
}