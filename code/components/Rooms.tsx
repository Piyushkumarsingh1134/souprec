"use client";

import { useEffect, useRef, useState } from "react";

type SignalMessage = {
  type: string;
  payload?: any;
  roomId?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

const ws = new WebSocket("ws://localhost:3000");

export default function Rooms({ roomIdFromUrl }: { roomIdFromUrl?: string }) {
  const [roomId, setRoomId] = useState<string>(roomIdFromUrl || "");
  const [joined, setJoined] = useState<boolean>(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunkCountRef = useRef<number>(0);

  // ------------------------- SIGNAL HANDLER -------------------------
  useEffect(() => {
    ws.onmessage = async (msg: MessageEvent) => {
      const data: SignalMessage = JSON.parse(msg.data);
      const pc = pcRef.current;
      if (!pc) return;

      if (data.offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ws.send(JSON.stringify({ type: "signal", payload: { answer } }));
      } else if (data.answer) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else if (data.candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    };
  }, []);

  // ------------------------- AUTO JOIN IF URL HAS ROOM -------------------------
  useEffect(() => {
    if (roomIdFromUrl) {
      joinRoom();
    }
  }, [roomIdFromUrl]);

  // ------------------------- JOIN ROOM -------------------------
  async function joinRoom() {
    if (!roomId) return alert("Enter room ID");

    ws.send(JSON.stringify({ type: "join", roomId }));
    setJoined(true);

    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }

    localStreamRef.current = localStream;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pcRef.current = pc;

    pc.ontrack = (event: RTCTrackEvent) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

    pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate) {
        ws.send(
          JSON.stringify({
            type: "signal",
            payload: { candidate: event.candidate },
          })
        );
      }
    };

    setTimeout(() => createOffer(pc), 500);

    startRecordingChunks(localStream);
  }

  // ------------------------- OFFER CREATION -------------------------
  async function createOffer(pc: RTCPeerConnection) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    ws.send(JSON.stringify({ type: "signal", payload: { offer } }));
  }

  // ------------------------- CHUNK RECORDING -------------------------
  function startRecordingChunks(stream: MediaStream) {
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = async (event: BlobEvent) => {
      if (event.data.size > 0) {
        await uploadChunk(event.data);
      }
    };

    recorder.start(3 * 60 * 1000); // 3 minutes
  }

  // ------------------------- FIXED UPLOAD FUNCTION -------------------------
  async function uploadChunk(blob: Blob) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found, cannot upload chunk.");
      return;
    }

    const formData = new FormData();
    formData.append("chunk", blob, `chunk-${chunkCountRef.current}.webm`);
    formData.append("index", chunkCountRef.current.toString());
    formData.append("recordingId", ""); // if you don’t have recordingId yet

    chunkCountRef.current++;

    const res = await fetch("http://localhost:3000/api/v1/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // REQUIRED
      },
      body: formData,
    });

    const data = await res.json();
    console.log("Chunk upload response:", data);

    if (!res.ok) {
      console.error("❌ Upload failed:", data);
    }
  }

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gradient-to-b from-white to-red-50">

      {/* JOIN INPUT ONLY WHEN MANUAL */}
      {!joined && !roomIdFromUrl && (
        <div className="mt-10 w-full max-w-lg flex gap-2">
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            className="border p-3 rounded-lg flex-1 shadow"
          />
          <button
            onClick={joinRoom}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
          >
            Join Room
          </button>
        </div>
      )}

      {/* VIDEO SECTION */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10 mt-10">

        {/* LOCAL VIDEO */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3 text-center">Local</h3>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="
              w-full 
              h-[250px]
              sm:h-[300px] 
              md:h-[380px] 
              lg:h-[500px]
              bg-black 
              rounded-xl 
              shadow-xl 
              object-cover
            "
          />
        </div>

        {/* REMOTE VIDEO */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3 text-center">Remote</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="
              w-full 
              h-[250px]
              sm:h-[300px]
              md:h-[380px]
              lg:h-[500px]
              bg-black 
              rounded-xl 
              shadow-xl 
              object-cover
            "
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-16 text-gray-500 text-sm">
        Powered by <span className="font-semibold text-red-600">Souprec</span>
      </footer>

    </div>
  );
}
