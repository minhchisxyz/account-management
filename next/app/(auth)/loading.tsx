
export default function Loading() {
  return (
      <div className={"flex flex-col items-center w-full p-2 md:p-10 overflow-hidden min-h-screen animate-pulse"}>
        {/*Desktop*/}
        <div className={`hidden md:flex w-full h-[120px] py-10 rounded-2xl backdrop-blur-xl bg-gray-200`}>
        </div>
        {/*Mobile*/}
        <div className={`block md:hidden w-9/12 h-[100px] py-2 rounded-2xl backdrop-blur-xl bg-gray-200`}>
        </div>
        <div className={`w-full md:h-full gap-2 pt-5 grid grid-cols-1 md:grid-cols-2 md:gap-10 md:flex-1`}>
          <div className={`h-full w-full flex flex-col items-center justify-center`}>
            <div className="w-full h-[250px] bg-gray-200"></div>
          </div>
          <div className={`h-full w-full flex flex-col items-center justify-center`}>
            <div className="w-full h-[250px] bg-gray-200"></div>
          </div>
        </div>
      </div>
  )
}