import React from "react";
import threeDotIcon from "../assets/icons/ThreeDots.svg";
import dateIcon from "../assets/icons/date.svg";
import folderIcon from "../assets/icons/normalFolder.svg";

export default function RightSideBar() {
  return (
    <div className="bg-custom_01 h-full w-3/5 p-10 flex flex-col gap-3">
      {/* Title for current Note  */}
      <div className="flex flex-row justify-between items-center">
        <p className="font-custom text-3xl text-white">
          Reflection on the Month of June
        </p>
        <img src={threeDotIcon} alt="" className="h-6 hover:cursor-pointer" />
      </div>

      {/* Date and Folder Details */}
      <div className="flex flex-col gap-2.5">
        <div className="flex gap-3 items-center">
          <img src={dateIcon} alt="" className="h-4" />
          <p className="text-custom text-white opacity-50 text-sm">Date</p>
          <p className="text-custom text-white underline text-sm">12/02/2025</p>
        </div>
        <hr className="text-white opacity-40 " />
        <div className="flex gap-3 items-center">
          <img src={folderIcon} alt="" className="h-4" />
          <p className="text-custom text-white opacity-50 text-sm">Folder</p>
          <p className="text-custom text-white underline text-sm">Personal</p>
        </div>
      </div>

      {/* Content for the Note  */}
      <textarea
        name="textArea"
        id="textArea"
        className="text-white font-custom text-sm"
        disabled
      >
        It's hard to believe that June is already over! Looking back on the
        month, there were a few highlights that stand out to me.
      </textarea>
    </div>
  );
}
