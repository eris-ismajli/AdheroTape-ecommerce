import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserName, updateUserPass } from "../store/auth/actions";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const oldName = user?.name;

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const toggleEditName = () => {
    if (editing) {
      if (name.trim() === "") {
        toast(`Name can't be empty`, {
          icon: <X className="text-red-400" />,
        });
        return;
      }
      if (name.trim().length < 2) {
        toast(`Name must be at least 2 characters`, {
          icon: <X className="text-red-400" />,
        });
        return;
      }
      if (oldName.trim() !== name.trim()) {
        dispatch(updateUserName(name));
        toast(`Name successfully updated!`, {
          icon: <Check className="text-green-400" />,
        });
      }
    }
    setEditing(!editing);
  };

  const changePassword = async () => {
    const trimmedCurrentPass = currentPassword.trim();
    const trimmedNewPass = newPassword.trim();

    if (trimmedNewPass === "" || trimmedCurrentPass === "") {
      toast(`Please fill in all the fields`, {
        icon: <X className="text-red-400" />,
      });
      return;
    }

    if (trimmedCurrentPass === "" || trimmedCurrentPass.length < 6) {
      toast(`Invalid current password`, {
        icon: <X className="text-red-400" />,
      });
      return;
    }

    if (trimmedNewPass.length < 6) {
      toast(`Password must be at least 6 characters`, {
        icon: <X className="text-red-400" />,
      });
      return;
    }

    try {
      await dispatch(updateUserPass(trimmedNewPass, trimmedCurrentPass));

      toast(`Password successfully updated!`, {
        icon: <Check className="text-green-400" />,
      });

      setNewPassword("");
      setCurrentPassword("");
    } catch (err) {
      // Show the specific error from the backend
      toast(err.message, {
        icon: <X className="text-red-400" />,
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-xl p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-zinc-400">{user?.email}</p>
        </div>

        {/* Display / Edit Name */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-zinc-300">
            Display Name
          </label>

          {editing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New name"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <p className="text-white px-4 py-2 bg-zinc-800 rounded-lg">
              {name}
            </p>
          )}

          <button
            onClick={toggleEditName}
            className={`w-full rounded-lg ${
              editing
                ? "bg-green-600 hover:bg-green-500"
                : "bg-indigo-600 hover:bg-indigo-500"
            }   transition px-4 py-2 font-medium`}
          >
            {editing ? "Apply Changes" : "Update Name"}
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-700" />

        {/* Change Password */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Change Password</h2>
          <input
            type="password"
            placeholder="Current password"
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password"
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={changePassword}
            className="w-full rounded-lg bg-red-600 hover:bg-red-500 transition px-4 py-2 font-medium"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
