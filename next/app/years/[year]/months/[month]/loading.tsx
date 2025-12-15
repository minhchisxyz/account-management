
export default function Loading() {
  return (
      <div className="flex h-screen w-full flex-col overflow-hidden gap-4 pb-6">
        <div className="flex-1 min-h-0 flex flex-col gap-4 animate-pulse">
          {/* graphs block takes some space at top (auto height) */}
          <div className="flex-none w-full">
            <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-2 md:gap-10">
              <div className="flex w-full h-[20vh] md:h-[25vh] bg-gray-200 flex-col items-center justify-center">

              </div>
              <div className="flex w-full h-[20vh] md:h-[25vh] bg-gray-200 flex-col items-center justify-center">

              </div>
            </div>
          </div>
          <div className="flex-1 bg-gray-200 min-h-0">

          </div>
        </div>
      </div>
  )
}