"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { FiEdit2, FiHome, FiPlus, FiSearch, FiTrash2, FiX } from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteRoom, setDeleteRoom] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_BASE}/rooms`);
      setRooms(response.data.rooms || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load rooms");
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    axios.get(`${API_BASE}/rooms`)
      .then((response) => {
        if (active) setRooms(response.data.rooms || []);
      })
      .catch((error) => {
        if (active) toast.error(error?.response?.data?.message || "Failed to load rooms");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const handleDeleteRoom = async () => {
    if (!deleteRoom) return;

    try {
      setDeleting(true);
      await axios.delete(`${API_BASE}/rooms/${deleteRoom._id}`);
      setDeleteRoom(null);
      fetchRooms();
      toast("Room deleted successfully", {
        className: "toast-deletion",
        description: "The room was removed from your storefront.",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete room");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (room) => {
    if (updatingStatus) return;

    const nextStatus = !room.status;
    setUpdatingStatus(room._id);
    setRooms((previous) => previous.map((item) => (
      item._id === room._id ? { ...item, status: nextStatus } : item
    )));

    try {
      const response = await axios.patch(`${API_BASE}/rooms/${room._id}/status`);
      const updatedRoom = response.data.room;
      setRooms((previous) => previous.map((item) => (
        item._id === updatedRoom._id ? updatedRoom : item
      )));
      toast.success(`Room marked ${updatedRoom.status ? "active" : "inactive"}`);
    } catch (error) {
      setRooms((previous) => previous.map((item) => (
        item._id === room._id ? { ...item, status: room.status } : item
      )));
      toast.error(error?.response?.data?.message || "Failed to update room status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] font-bold text-[#17212b]">Rooms</h1>
          <p className="mt-1 text-[14px] text-slate-500">
            Manage the spaces shown on your storefront
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/rooms/add")}
          className="flex items-center gap-2 rounded-[10px] bg-[#10b99a] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#0da88c]"
        >
          <FiPlus size={18} />
          Add Room
        </button>
      </div>

      <div className="rounded-[16px] border border-[#e8e5df] bg-white">
        <div className="flex items-center justify-between border-b border-[#eeeae3] p-5">
          <div>
            <h2 className="text-[17px] font-semibold text-[#17212b]">All Rooms</h2>
            <p className="mt-1 text-[13px] text-slate-500">
              {loading ? "Loading..." : `${filteredRooms.length} rooms`}
            </p>
          </div>

          <div className="relative">
            <FiSearch size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search rooms..."
              className="h-[40px] w-[240px] rounded-[9px] border border-[#e5e2dc] pl-10 pr-3 text-[13px] outline-none transition focus:border-[#10b99a]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead>
              <tr className="border-b border-[#eeeae3] text-left">
                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Room</th>
                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Slug</th>
                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Pieces</th>
                <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Status</th>
                <th className="px-6 py-4 text-right text-[12px] font-semibold uppercase tracking-wide text-slate-500">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRooms.map((room) => (
                <tr key={room._id} className="border-b border-[#f1eee9] last:border-0 hover:bg-[#faf9f7]">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {room.image ? (
                        <img src={room.image} alt={room.name} className="h-[42px] w-[42px] rounded-[9px] object-cover" />
                      ) : (
                        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[9px] bg-[#eef8f5] text-[#10b99a]">
                          <FiHome size={18} />
                        </div>
                      )}
                      <span className="text-[14px] font-semibold text-[#17212b]">{room.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-[13px] text-slate-500">/{room.slug}</td>
                  <td className="px-6 py-5 text-[13px] text-slate-500">{room.count ?? 0}</td>

                  <td className="px-6 py-5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(room)}
                      disabled={updatingStatus === room._id}
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                        room.status ? "bg-[#e8f8f3] text-[#0d9f83]" : "bg-[#f1f1f1] text-slate-500"
                      } transition hover:opacity-75 disabled:cursor-wait disabled:opacity-60`}
                    >
                      {room.status ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => router.push(`/admin/rooms/${room._id}`)}
                        aria-label={`Edit ${room.name}`}
                        className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] text-slate-500 transition hover:bg-[#eef8f5] hover:text-[#10b99a]"
                      >
                        <FiEdit2 size={16} />
                      </button>

                      <button
                        onClick={() => setDeleteRoom(room)}
                        aria-label={`Delete ${room.name}`}
                        className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredRooms.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[14px] text-slate-500">
                    No rooms found. Add your first room to get started.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[14px] text-slate-500">
                    Loading rooms...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteRoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[420px] rounded-[16px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-red-50 text-red-500">
                <FiTrash2 size={20} />
              </div>

              <button
                onClick={() => setDeleteRoom(null)}
                className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-[8px] text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="mt-5">
              <h2 className="text-[19px] font-bold text-[#17212b]">Delete Room?</h2>
              <p className="mt-2 text-[14px] leading-6 text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#17212b]">&quot;{deleteRoom.name}&quot;</span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setDeleteRoom(null)}
                className="cursor-pointer rounded-[9px] border border-[#e5e2dc] px-5 py-2.5 text-[13px] font-semibold text-slate-600 transition hover:bg-[#f8f7f4]"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteRoom}
                disabled={deleting}
                className="cursor-pointer rounded-[9px] bg-red-500 px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-red-600 disabled:cursor-wait disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
