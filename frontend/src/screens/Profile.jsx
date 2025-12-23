import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserName, updateUserPass } from "../store/auth/actions";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Check,
  Heart,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import Header from "../components/Header";
import { useProfileModal } from "../components/ProfileModalContext";
import { Eye, EyeOff } from "lucide-react";
import Modal from "../components/Modal";
import { useNavigate, useNavigation } from "react-router-dom";

const Profile = () => {
  const { setShowProfileModal } = useProfileModal();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showPassModal, setShowPassModal] = useState(false);

  const navigate = useNavigate();

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

    setShowPassModal(false);
  };

  const handlePassChange = () => {
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

    setShowPassModal(true);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={() => setShowProfileModal(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
      />
      {showPassModal && (
        <Modal
          message={"Are you sure you want to change your password?"}
          onConfirm={changePassword}
          onCancel={() => setShowPassModal(false)}
          title={"Update Password"}
        />
      )}

      {/* Modal */}
      <div
        className="
        relative w-full max-w-[450px]
        rounded-2xl border border-white/5 bg-black
        shadow-[0_0_40px_rgba(0,0,0,0.6)]
        p-6 space-y-6
        animate-in fade-in zoom-in-95
      "
      >
        <div
          onClick={() => {
            setShowProfileModal(false);
          }}
          className="justify-self-end cursor-pointer text-zinc-400 hover:text-white hover:scale-105"
        >
          <X />
        </div>
        <div className="pointer-events-none absolute -top-32 -left-32 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-20 w-[400px] h-[400px] bg-orange-300/10 rounded-full blur-[120px]" />

        {/* Header */}
        <div style={{ margin: "0" }} className="text-center">
          <p className="text-xs tracking-widest text-blue-500">
            {user?.role?.toUpperCase()}
          </p>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-zinc-400">{user?.email}</p>
          {user?.role === "admin" && (
            <button
              onClick={() => {
                navigate("/admin/dashboard");
                setShowProfileModal(false);
              }}
              className="
    group flex w-full justify-center items-center gap-2 mt-1
    text-blue-300 font-medium
    transition-all duration-200 ease-out
    hover:text-blue-200
  "
            >
              <span className="relative">
                Admin Dashboard
                <span
                  className="
        absolute left-0 -bottom-0.5 h-[1px] w-0
        bg-blue-300 transition-all duration-200
        group-hover:w-full
      "
                />
              </span>

              <ArrowRight
                size={20}
                className="
      transition-transform duration-200
      group-hover:translate-x-1
    "
              />
            </button>
          )}
        </div>

        <div className="border-t border-zinc-800" />


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
            <p className="text-white px-4 py-2 bg-zinc-950 rounded-lg">
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
        <div className="border-t border-zinc-800" />

        {/* Change Password */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Change Password</h2>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Current password"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2 pr-10
               text-white placeholder-zinc-500 focus:outline-none
               focus:ring-2 focus:ring-indigo-500"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowCurrentPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2
               text-zinc-400 hover:text-white"
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New password"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2 pr-10
               text-white placeholder-zinc-500 focus:outline-none
               focus:ring-2 focus:ring-indigo-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowNewPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2
               text-zinc-400 hover:text-white"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            onClick={handlePassChange}
            className="w-full rounded-lg bg-orange-600 hover:bg-orange-500 transition px-4 py-2 font-medium"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
