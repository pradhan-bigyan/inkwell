import React from "react";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className=" flex items-center text-gray-300 gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-gray-300 font-medium bg-gray-700">
        {getInitials(userInfo?.full_name)}
      </div>

      <div>
        <p className="text-sm font-medium">{userInfo?.full_name}</p>
        <button className="text-sm text-slate-400 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
