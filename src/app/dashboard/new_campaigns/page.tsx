"use client";

import { Button } from "@/components/ui/button";
import { X, Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import React from "react";


export default function Page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div 
    >
      <div className="flex justify-between items-center p-6 border-b pb-4">
        <h1 className="text-3xl font-semibold">
          Create <span className="text-[#01A0A2]">Campaigns</span>
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <X size={18} /> Cancel
          </Button>
          <Button className="bg-[#01A0A2] text-white flex items-center gap-2">
            <Check size={18} /> Create
          </Button>
        </div>
      </div>
      <div className="px-10 pt-16 flex justify-between items-start">
        <form>
          <div className="flex flex-col gap-8">
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <Label htmlFor="contacts" className="w-32">
                  Select Contacts
                </Label>
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    id="contacts"
                    placeholder="Search Contacts"
                    className="pl-10 rounded-lg border-gray-200 w-[400px]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="location" className="w-32">
                  Target Location
                </Label>
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    id="location"
                    placeholder="Search Location"
                    className="pl-10 rounded-lg border-gray-200 w-[400px]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="time" className="w-32">
                  Time
                </Label>
                <div className="flex gap-2 flex-1">
                  <Select defaultValue="AM">
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="AM/PM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) =>
                        Array.from({ length: 4 }, (_, i) => i * 15).map((minute) => (
                          <SelectItem
                            key={`${hour}:${minute}`}
                            value={`${hour}:${minute.toString().padStart(2, '0')}`}
                          >
                            {`${hour}:${minute.toString().padStart(2, '0')}`}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Label htmlFor="agent" className="w-32">
                  Select Agent
                </Label>
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    id="agent"
                    placeholder="Search Agent"
                    className="pl-10 rounded-lg border-gray-200 w-[400px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
        <Calendar
          mode="single"
          className="rounded-md border shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
          selected={date}
          onSelect={setDate}
          classNames={{
            day_selected: "bg-[#01A0A2] text-white hover:bg-[#01A0A2] hover:text-white",
          }}
          title="Select Date"
        />
      </div>
    </div>
  );
}
