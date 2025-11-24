"use client";

import { useEffect, useState } from "react";

interface Chunk {
  index: number;
  url: string;
  recordingId: string;
}

export default function RoomsDetails({ roomIdFromUrl }: { roomIdFromUrl: string }) {
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch chunks when component loads
  useEffect(() => {
    async function fetchChunks() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:3000/api/v1/room/getRoomDetails?roomCode=${roomIdFromUrl}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        console.log(data);

        if (!res.ok) {
          setError(data.error || "Failed to fetch room data.");
        } else {
          setChunks(data.chunks || []);
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }

    fetchChunks();
  }, [roomIdFromUrl]);

  if (loading) return <p className="p-10 text-xl">Loading chunks...</p>;
  if (error) return <p className="p-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">
        🎥 Chunks for Room: {roomIdFromUrl}
      </h1>

      {chunks.length === 0 ? (
        <p className="text-gray-600 text-lg">No chunks uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chunks.map((chunk) => (
            <div
              key={chunk.index}
              className="bg-white p-5 rounded-xl shadow-md border"
            >
              <h2 className="text-lg font-semibold mb-3">
                Chunk #{chunk.index}
              </h2>

              <video
                src={chunk.url}
                controls
                className="rounded-lg w-full h-60 bg-black"
              />

              <p className="text-sm text-gray-500 mt-2">
                Recording ID: {chunk.recordingId}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
