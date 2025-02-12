export default function CenterBar() {
  const currnNotes = [...Array(5)];
  const testString =
    "It's hard to believe that June is already over! Looking back on the month, there were a few highlights that stand out to me.";
  return (
    <div className="bg-custom_02 h-full w-1/5 py-5 flex flex-col gap-2">
      {/* Header Text  */}
      <p className="font-custom text-lg text-white px-4">Personal</p>

      {/* All Current Shown Notes  */}
      <div className="flex flex-col gap-1.5 px-4 h-full overflow-y-auto">
        {currnNotes.map(() => (
          <a
            href="#"
            className="bg-custom_03 rounded-sm p-3 flex flex-col gap-1.5"
          >
            {/* Note Title  */}
            <p className="text-white font-custom ">My Goals for next year</p>
            {/* Date and Contain...  */}
            <div className="flex gap-x-3 h-5 overflow-hidden ">
              <p className="font-custom text-sm text-white opacity-40">
                12/02/2025
              </p>
              <p className="font-custom text-sm text-white opacity-60">
                {testString.substring(0, 20).concat("...")}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
