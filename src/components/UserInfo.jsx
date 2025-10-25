"use client"

import { useSession } from "next-auth/react"


export default function UserInfo() {
    const session = useSession();
    return <div className="text-black">
        <p>{JSON.stringify(session)}</p>
    </div>
}