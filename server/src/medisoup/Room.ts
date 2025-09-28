import { getWorker } from "./worker";


interface MediaPeer{
    socket:WebSocket
    userId:string;
    transports:any;
    producers: any;
    consumers: any;
    role: "HOST" | "GUEST";
    participantId: string;
}

interface MediaRoom {
  router: any;
  peers: Map<string, MediaPeer>;
}


const rooms = new Map<string, MediaRoom>();


export async function createmediasoupRoom(roomId:string) {
    if (rooms.has(roomId)) return rooms.get(roomId);
    const worker=getWorker();
    const router=await worker.createRouter({
        mediaCodecs:[
            { kind: "audio", mimeType: "audio/opus", clockRate: 48000, channels: 2 },
         { kind: "video", mimeType: "video/VP8", clockRate: 90000 },
        ],
    })

    const room:MediaRoom={router,peers:new Map()};
    rooms.set(roomId,room);
}



export function getMediasoupRoom(roomId: string) {
  return rooms.get(roomId);
}