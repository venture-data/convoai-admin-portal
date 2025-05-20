import React from 'react'
import PropertyField from './PropertyField';
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { RequestBodyProperty } from './RequestBodyBuilder';

interface QueryBuilderProps {
  properties: RequestBodyProperty[];
  setProperties: (properties: RequestBodyProperty[]) => void;
  handleAddProperty: () => void;
  isNested?: boolean;
}

function QueryBuilder({ properties, setProperties, handleAddProperty, isNested = false }: QueryBuilderProps) {
  const handlePropertyChange = (index: number, updatedProperty: RequestBodyProperty) => {
    const newProperties = [...properties];
    newProperties[index] = updatedProperty;
    setProperties(newProperties);
  };
  
  const handleDeleteProperty = (index: number) => {
    setProperties(properties.filter((_, i) => i !== index));
  };
  
  return (
    <div>
      {properties.map((property, index) => (
        <div key={`${property.name}-${index}`}>
          <PropertyField 
            property={property} 
            onPropertyChange={(updatedProperty) => handlePropertyChange(index, updatedProperty)}
            onDelete={() => handleDeleteProperty(index)}
          />
        </div>
      ))}
      
      <div className={`p-4 ${properties.length > 0 ? 'border-t border-white/10' : ''}`}>
        <Button
          onClick={handleAddProperty}
          variant={isNested ? "ghost" : "outline"}
          size={isNested ? "sm" : "default"}
          className={isNested 
            ? "flex items-center gap-1 text-orange-500 hover:text-orange-600 hover:bg-orange-500/10" 
            : "flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/10"
          }
        >
          <PlusIcon className={isNested ? "h-3 w-3" : "h-4 w-4"} />
          <span className={isNested ? "text-xs" : "text-sm"}>
            {isNested ? "Add Sub-Property" : "Add Property"}
          </span>
        </Button>
      </div>
    </div>
  )
}

export default QueryBuilder