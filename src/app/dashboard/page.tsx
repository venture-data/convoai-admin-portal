"use client"

import { useSession } from "next-auth/react";


export default function Page() {
  const { data, isLoading, error } = useSession();
  console.log("data",data);
    return (
      <div>
        <h1>Dashboard</h1>
      </div>
    );
  }