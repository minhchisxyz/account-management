
export default function Loading() {
  return (
      <div className="flex h-screen w-full justify-center px-4 sm:px-6 lg:px-10 py-4 overflow-hidden">
        <div className="flex min-h-0 w-full max-w-6xl flex-col gap-4 flex-1 animate-pulse">
          <div className="w-full flex-none">
            <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="w-full h-[20vh] md:h-[25vh] bg-gray-200 flex flex-col items-center justify-center">

              </div>
              <div className="w-full h-[20vh] md:h-[25vh] bg-gray-200 flex flex-col items-center justify-center">

              </div>
            </div>
          </div>

          {/* table area takes remaining height and scrolls internally */}
          <div className="w-full h-[30vh] md:h-[40vh] bg-gray-200 min-h-0">

          </div>
        </div>
      </div>
  )
}