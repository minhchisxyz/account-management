import {EuroIcon, VietnamIcon} from "@/components/icons";

export function CurrencyGraphLoading() {
  return <div className={"w-full max-w-5xl mx-auto overflow-x-auto animate-pulse h-[60vh] bg-gray-200"}/>
}

export default function CurrencyLoadingPage() {
  const shadow = 'shadow-[4px_4px_8px_#dddddd,-4px_-4px_6px_#ffffff]'
  const hover = 'hover:shadow-none hover:inset-shadow-[-4px_4px_8px_#dddddd,4px_-4px_6px_#ffffff] hover:cursor-pointer'
  const linkClass = `flex items-center justify-center w-32 h-9 px-2 py-1 rounded-md bg-white/15 backdrop-blur-md ${shadow} ${hover}`
  return (
      <div className={"flex flex-col items-center justify-start w-full max-h-screen py-4 px-4 md:px-10 gap-10"}>
        <CurrencyGraphLoading/>

        {/* bottom block: quick conversion */}
        <div className={"w-full max-w-3xl mx-auto flex flex-col items-center justify-center gap-5 px-2"}>
          <h1 className={"font-bold text-2xl sm:text-3xl md:text-4xl text-center"}>
            Quick Conversion
          </h1>
          <div className={"w-full flex flex-col md:flex-row gap-6 md:gap-16 items-center justify-center"}>
            <div className={"w-full md:w-auto flex flex-row gap-2 items-center justify-center"}>
              <EuroIcon/>
              <input
                  value={0}
                  readOnly
                  type="number"
                  className={`${linkClass} max-w-xs w-64 text-center`}
              />
            </div>
            <div className={"w-full md:w-auto flex flex-row gap-2 items-center justify-center"}>
              <VietnamIcon/>
              <button className={`${linkClass} max-w-xs w-64`}>
                0
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}