export function EuroIcon() {
    const url = 'https://www.vietcombank.com.vn/-/media/Default-Website/Default-Images/Icons/Flags/im_flag_eur.svg?h=32&w=32&ts=20230610195949&hash=88CF4CDE8DB12CA0D56485A05EC27A22'
    return (
        <div className="mb-2 flex justify-center items-center">
            <img src={url} alt={`Euro`} className="h-8" />
        </div>
    )
}

export function VietnamIcon() {
    const url = 'https://www.vietcombank.com.vn/-/media/Default-Website/Default-images/Icons/Language/VIE.png?db=web'
    return (
        <div className="mb-2 flex justify-center items-center">
            <img src={url} alt={`Euro`} className="h-8" />
        </div>
    )
}