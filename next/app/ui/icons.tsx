import Image from "next/image";

export function EuroIcon() {
    const url = '/euro.svg'
    return (
        <div className="flex justify-center items-center">
            <Image src={url} alt={`Euro`} height={36} width={48}/>
        </div>
    )
}

export function VietnamIcon() {
    const url = '/vn.svg'
    return (
        <div className="flex justify-center items-center">
            <Image src={url} alt={`Euro`} height={36} width={48}/>
        </div>
    )
}