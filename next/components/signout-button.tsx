'use client'

import {signOut} from "@/app/lib/auth";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {LogOut} from "lucide-react";

export default function SignOutButton() {
  return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={async () => await signOut()}
                  className={`fixed z-1000 top-3 right-3 rounded-full p-2 shadow-[4px_4px_8px_#dddddd,-4px_-4px_6px_#ffffff] hover:shadow-none hover:inset-shadow-[-4px_4px_8px_#dddddd,4px_-4px_6px_#ffffff] hover:cursor-pointer`}>
            <LogOut/>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sign Out</p>
        </TooltipContent>
      </Tooltip>
  )
}