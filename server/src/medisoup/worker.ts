import * as mediasoup from "mediasoup"

let worker:mediasoup.types.Worker;

export async function createWorker(){
     if( worker) return worker;

     worker=await mediasoup.createWorker({
        rtcMinPort:20000,
        rtcMaxPort:20100,
        logLevel:"warn"
     })


     worker.on("died", () => {
    console.error("Mediasoup worker died");
    process.exit(1);
  });

    return worker;
}


export function getWorker() {
  if (!worker) throw new Error("Worker not initialized");
  return worker;
}