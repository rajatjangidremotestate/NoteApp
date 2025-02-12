import React from "react";
import threeDotIcon from "../assets/icons/ThreeDots.svg";
import dateIcon from "../assets/icons/date.svg";
import folderIcon from "../assets/icons/normalFolder.svg";

export default function RightSideBar() {
  return (
    <div className="bg-custom_01 h-full w-3/5 p-10 flex flex-col gap-2">
      {/* Title for current Note  */}
      <div className="flex flex-row justify-between ">
        <p className="font-custom text-3xl text-white">
          Reflection on the Month of June
        </p>
        <img src={threeDotIcon} alt="" className="h-7" />
      </div>

      {/* Date and Folder Details */}
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-3">
          <img src={dateIcon} alt="" />
          <p className="text-custom text-white opacity-50">Date</p>
          <p className="text-custom text-white underline">12/02/2025</p>
        </div>
        <hr className="text-white opacity-40" />
        <div className="flex gap-3">
          <img src={dateIcon} alt="" />
          <p className="text-custom text-white opacity-50">Folder</p>
          <p className="text-custom text-white underline">Personal</p>
        </div>
      </div>
    </div>
  );
}
