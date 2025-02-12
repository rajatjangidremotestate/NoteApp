import LeftSideBar from "./LeftSideBar";
import CenterBar from "./CenterBar";
import RightSideBar from "./RightSideBar";

export default function FullBody() {
  return (
    <div className="flex h-screen w-screen bg-white">
      <LeftSideBar />
      <CenterBar />
      <RightSideBar />
    </div>
  );
}
