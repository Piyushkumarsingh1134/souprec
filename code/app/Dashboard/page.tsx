"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateRoomModal } from "../../components/Createroom"; // <-- your modal

interface Room {
  id: string;
  roomCode: string;
  title: string | null;
  description: string | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);

  // ---------------------------------------------------------------------------
  // FETCH ROOMS CREATED BY USER
  // ---------------------------------------------------------------------------
  async function loadRooms() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(
      "http://localhost:3000/api/v1/room/getRoomsCreatedByUser",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    console.log("Rooms API:", data);

    setRooms(data.rooms || []); // <-- FIXED
  }

  useEffect(() => {
    loadRooms();
  }, []);

  // ---------------------------------------------------------------------------
  // JOIN ROOM
  // ---------------------------------------------------------------------------
  function joinRoom() {
    if (!joinRoomId.trim()) {
      alert("Enter room ID");
      return;
    }
    router.push(`/rooms/${joinRoomId}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-red-50 p-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          🎙️ Creator Dashboard
        </h1>

        <button
          onClick={() => setOpenCreateModal(true)}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg font-semibold transition"
        >
          + Create Room
        </button>
      </div>

      {/* JOIN ROOM */}
      <div className="flex items-center gap-3 mb-10">
        <input
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value)}
          placeholder="Enter Room ID"
          className="border border-gray-300 p-3 rounded-lg w-72 shadow-sm focus:ring-2 focus:ring-red-400 outline-none"
        />

        <button
          onClick={joinRoom}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition"
        >
          Join Room
        </button>
      </div>

      {/* ROOM LIST */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📁 Your Rooms</h2>

      {rooms.length === 0 ? (
        <p className="text-gray-500 text-lg">
          You haven't created any rooms yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="p-6 bg-white shadow-xl rounded-2xl border border-gray-100 hover:shadow-2xl transition"
            >
              <h3 className="text-xl font-bold text-gray-900">{room.title}</h3>

              <p className="text-gray-600 text-sm mt-1">
                Room Code:{" "}
                <span className="font-mono text-red-500">
                  {room.roomCode}
                </span>
              </p>

              <p className="text-gray-500 mt-2 line-clamp-2">
                {room.description}
              </p>

             
              <button
  onClick={() => router.push(`/rooms/${room.roomCode}`)}
  className="mt-4 w-full px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
>
  Open Room
</button>

      <button
  onClick={() => router.push(`/rooms/${room.roomCode}/chunks`)}
  className="w-1/2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
>
  Get Details
</button>
            </div>
          ))}
        </div>
      )}

      {/* CREATE ROOM MODAL */}
      <CreateRoomModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreated={loadRooms}
      />
    </div>
  );
}

