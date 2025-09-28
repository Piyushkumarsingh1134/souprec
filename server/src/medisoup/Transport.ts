import * as mediasoup from "mediasoup";
import { Router, WebRtcTransport } from "mediasoup/types";

export async function createWebRtcTransport(router: Router): Promise<{ transport: WebRtcTransport, params: any }> {
  const transport = await router.createWebRtcTransport({
    listenIps: [{ ip: "0.0.0.0", announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP }],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  });

  return {
    transport,
    params: {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    },
  };
}

