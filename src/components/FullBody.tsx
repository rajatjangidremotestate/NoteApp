import LeftSideBar from "./LeftSideBar/LeftSideBar";
import CenterBar from "./CenterBar";
import RightSideBar from "./RightSideBar/RightSideBar";

export default function FullBody() {
  return (
    <div className="flex h-screen w-screen bg-white">
      <LeftSideBar />
      <CenterBar />
      <RightSideBar />
    </div>
  );
}
