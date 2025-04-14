"use client"
import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/dashboard/new_agents");
}

