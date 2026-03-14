import { motion } from "framer-motion";
import { useAdmin } from "./context/AdminContext";
import { UserX } from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useDebounce } from "../../hooks/useDebounce";

import { toast } from "react-toastify";

export default function AdminUsers() {
  const {
    users,
    updateUser,
    deleteUser,
    fetchUsers,
    totalUserPages,
  } = useAdmin();

  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchUsers({ search: debouncedSearch, page, limit: 10 });
  }, [debouncedSearch, page]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingUserId(id);
    try {
      await updateUser(id, { status: newStatus });
      toast.success(
        newStatus === "active"
          ? "User activated successfully"
          : "User blocked successfully"
      );
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    setUpdatingUserId(id);
    try {
      await updateUser(id, { role: newRole });
      toast.success(
        newRole === "admin"
          ? "User promoted to admin"
          : "User changed to normal user"
      );
    } catch (err) {
      toast.error("Failed to update role");
    } finally {
      setUpdatingUserId(null);
    }
  };


  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      background: "#111827",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully");
      } catch {
        toast.error("Failed to delete user");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 flex justify-center ml-40">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 sm:p-8 w-full max-w-6xl"
      >
        { }
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-[Cinzel] tracking-widest text-slate-100">
            Manage Users
          </h2>

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
        </div>

        { }
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base">
            <thead className="bg-gray-800 text-slate-300 uppercase">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Role</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-gray-800 hover:bg-gray-800/40"
                >
                  <td className="p-4 text-slate-100">{u.name}</td>
                  <td className="p-4 text-slate-400">{u.email}</td>

                  { }
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() =>
                          handleStatusChange(
                            u.id,
                            u.status === "active" ? "blocked" : "active"
                          )
                        }
                        disabled={updatingUserId === u.id}
                        className={`relative w-12 h-6 rounded-full
                          ${u.status === "active" ? "bg-green-500" : "bg-red-500"}
                          ${updatingUserId === u.id ? "opacity-50" : ""}`}
                      >
                        <motion.div
                          animate={{ x: u.status === "active" ? 26 : 2 }}
                          className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full"
                        />
                      </button>

                      <span
                        className={`text-xs font-semibold
                          ${u.status === "active" ? "text-green-400" : "text-red-400"}`}
                      >
                        {u.status === "active" ? "Active" : "Block"}
                      </span>
                    </div>
                  </td>

                  { }
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() =>
                          handleRoleChange(
                            u.id,
                            u.role === "admin" ? "user" : "admin"
                          )
                        }
                        disabled={updatingUserId === u.id}
                        className={`relative w-12 h-6 rounded-full
                          ${u.role === "admin" ? "bg-green-500" : "bg-red-500"}
                          ${updatingUserId === u.id ? "opacity-50" : ""}`}
                      >
                        <motion.div
                          animate={{ x: u.role === "admin" ? 26 : 2 }}
                          className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full"
                        />
                      </button>

                      <span
                        className={`text-xs font-semibold
                          ${u.role === "admin" ? "text-green-400" : "text-red-400"}`}
                      >
                        {u.role === "admin" ? "Admin" : "User"}
                      </span>
                    </div>
                  </td>

                  { }
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={updatingUserId === u.id}
                      className="text-red-500 hover:text-red-400 disabled:opacity-50"
                    >
                      <UserX size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        { }
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 rounded-lg text-white"
          >
            Previous
          </button>

          <span className="px-4 py-2 bg-gray-900 rounded-lg text-white">
            Page {page} of {totalUserPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalUserPages))}
            disabled={page === totalUserPages}
            className="px-4 py-2 bg-gray-800 rounded-lg text-white"
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  );
}
