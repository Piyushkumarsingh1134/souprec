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

const getWebSocketUrl = () => {
  return process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000";
};

const ws = typeof window !== "undefined" ? new WebSocket(getWebSocketUrl()) : null;

export default function Rooms({ roomIdFromUrl }: { roomIdFromUrl?: string }) {
  const [roomCode, setRoomCode] = useState(roomIdFromUrl || "");
  const [joined, setJoined] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIdRef = useRef<string | null>(null);
  const chunkCountRef = useRef(0);

  // ---------------- SIGNAL HANDLING ----------------
  useEffect(() => {
    if (!ws) return;
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

  // Auto join
  useEffect(() => {
    if (roomIdFromUrl) joinRoom();
  }, [roomIdFromUrl]);

  // ---------------- CREATE RECORDING ----------------
  async function createRecording(roomCode: string) {
    const token = localStorage.getItem("token");
    if (!token) return console.error("❌ No token found.");

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";
    const res = await fetch(`${API_BASE_URL}/recording/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roomCode }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Failed to create recording", data);
      return;
    }

    console.log("🎬 Recording created:", data.recordingId);
    recordingIdRef.current = data.recordingId;
  }

  // ---------------- JOIN ROOM ----------------
  async function joinRoom() {
    if (!roomCode) return alert("Enter room code");

    ws?.send(JSON.stringify({ type: "join", roomId: roomCode }));
    setJoined(true);

    // Create recording before chunks begin
    await createRecording(roomCode);

    // Camera
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current = stream;

    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    // Peer connection
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ws?.send(JSON.stringify({ type: "signal", payload: { candidate: event.candidate } }));
      }
    };

    setTimeout(() => createOffer(pc), 500);

    // Start recording chunks (loop)
    startChunkLoop(stream);
  }

  async function createOffer(pc: RTCPeerConnection) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    ws?.send(JSON.stringify({ type: "signal", payload: { offer } }));
  }

  // ---------------- CHUNK RECORDING LOOP ----------------
  function startChunkLoop(stream: MediaStream) {
    async function recordOneChunk(index: number) {
      let options = { mimeType: "video/webm;codecs=vp8" };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: "video/webm" };
      }

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      console.log(`⏳ Recording chunk #${index} ...`);

      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          console.log("🎥 Chunk ready:", event.data);
          await uploadChunk(event.data, index);
        }
      };

      recorder.onstop = () => {
        chunkCountRef.current += 1;
        setTimeout(() => recordOneChunk(chunkCountRef.current), 200); // next chunk
      };

      recorder.start();
      setTimeout(() => recorder.stop(), 3 * 60 * 1000); // stop after 3 min
    }

    recordOneChunk(0);
  }

  // ---------------- UPLOAD CHUNK ----------------
  async function uploadChunk(blob: Blob, index: number) {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!recordingIdRef.current) return;

    const formData = new FormData();
    formData.append("chunk", blob, `chunk-${index}.webm`);
    formData.append("index", String(index));
    formData.append("recordingId", recordingIdRef.current);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    console.log("Upload response:", data);

    if (!res.ok) console.error("❌ Upload failed:", data);
    else console.log(`✅ Chunk uploaded: ${index}`);
  }

  // ---------------- UI ----------------
  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gradient-to-b from-white to-red-50">

      {!joined && !roomIdFromUrl && (
        <div className="mt-10 w-full max-w-lg flex gap-2">
          <input
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="Enter Room Code"
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

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10 mt-10">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3 text-center">Local</h3>
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-[300px] bg-black rounded-xl" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-3 text-center">Remote</h3>
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-[300px] bg-black rounded-xl" />
        </div>
      </div>
    </div>
  );
}
