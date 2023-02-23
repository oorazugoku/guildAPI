import { useRouter } from "next/router";
import React from "react";

export default function Users() {
    const router = useRouter()
    const { id } = router.query;
    return (
        <>user {id}</>
    )
}
