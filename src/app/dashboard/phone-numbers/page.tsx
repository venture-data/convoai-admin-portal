"use client"

import { useState } from "react";
import PhoneNumbersSidebar from "./components/PhoneNumbersSidebar";
import PhoneNumberConfig from "./components/PhoneNumberConfig";
import { SipTrunkItem } from "./types";
import { CreatePhoneNumberModal } from "./components/CreatePhoneNumberModal";
import { useSip } from "@/app/hooks/use-sip";

interface PhoneNumberFormData {
  name: string;
  phone_number: string;
  sip_termination_uri: string;
  username: string;
  password: string;
}


export default function PhoneNumbersPage() {
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<SipTrunkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sipTrunks, isLoading, createSipTrunk } = useSip();

  const handleUpdateSettings = () => {
    if (!selectedPhoneNumber) return;
    
    const updatedPhoneNumber = {
      ...selectedPhoneNumber,
    };
    
    setSelectedPhoneNumber(updatedPhoneNumber);
  };

  const handleCreatePhoneNumber = async (formData: PhoneNumberFormData) => {
    try {
      await createSipTrunk(formData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create phone number:", error);
      throw error;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-40px)]">
      <PhoneNumbersSidebar 
        isLoading={isLoading} 
        displayedPhoneNumbers={sipTrunks as {items: SipTrunkItem[]}} 
        selectedPhoneNumberId={selectedPhoneNumber?.id || null} 
        handleSelectPhoneNumber={setSelectedPhoneNumber} 
        handleDeletePhoneNumber={() => {}} 
        deletingPhoneNumberId={null} 
        searchQuery="" 
        setSearchQuery={() => {}} 
        setIsTemplateModalOpen={setIsModalOpen} 
      />
      <div className="flex-1">
        {selectedPhoneNumber ? (
          <PhoneNumberConfig 
            phoneNumber={selectedPhoneNumber}
            onUpdate={handleUpdateSettings}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a phone number to configure
          </div>
        )}
      </div>
      <CreatePhoneNumberModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePhoneNumber}
      />
    </div>
  );
}

