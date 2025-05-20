import React from 'react'
import QueryBuilder from './QueryBuilder';
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RequestBodyProperty } from './RequestBodyBuilder';

interface PropertyFieldProps {
  property: RequestBodyProperty;
  onPropertyChange: (property: RequestBodyProperty) => void;
  onDelete: () => void;
}

function PropertyField({ property, onPropertyChange, onDelete }: PropertyFieldProps) {
  return (
    <div className="p-4 border-b border-white/10 last:border-0">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <Label className="text-xs text-white/60">Property Name</Label>
          <Input
            value={property.name}
            onChange={(e) => onPropertyChange({ ...property, name: e.target.value })}
            className="mt-1 bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:ring-orange-500/20"
          />
        </div>
        <div className="col-span-3">
          <Label className="text-xs text-white/60">Type</Label>
          <select
            value={property.type}
            onChange={(e) => onPropertyChange({ ...property, type: e.target.value })}
            className="mt-1 flex h-10 w-full rounded-md border border-white/10 bg-[#1A1D25]/70 px-3 py-2 text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30 focus-visible:ring-offset-2"
          >
            <option value="string">string</option>
            <option value="number">number</option>
            <option value="boolean">boolean</option>
            <option value="object">object</option>
            <option value="array">array</option>
          </select>
        </div>
        <div className="col-span-4">
          <Label className="text-xs text-white/60">Description</Label>
          <Input
            value={property.description || ''}
            onChange={(e) => onPropertyChange({ ...property, description: e.target.value })}
            className="mt-1 bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:ring-orange-500/20"
          />
        </div>
        <div className="col-span-1 flex items-end justify-end">
          <Button 
            onClick={onDelete}
            variant="ghost" 
            size="icon" 
            className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-2">
        <div className="flex items-center space-x-2">
          <Switch 
            id={`required-${property.name}`}
            checked={property.required} 
            onCheckedChange={(checked) => onPropertyChange({ ...property, required: checked })}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-red-500"
          />
          <Label htmlFor={`required-${property.name}`} className="text-white/80">Required</Label>
        </div>
      </div>
      
      {property.type === 'object' && (
        <div className="mt-3 pl-4 border-l-2 border-orange-500/30">
          <div className="mt-2 bg-white/5 rounded-md p-3">
            <h4 className="text-xs font-medium text-orange-400 mb-2">Object Properties</h4>
            <QueryBuilder 
              properties={property.properties || []}
              setProperties={(newProps) => onPropertyChange({ ...property, properties: newProps })}
              handleAddProperty={() => onPropertyChange({ 
                ...property, 
                properties: [
                  ...(property.properties || []), 
                  { 
                    name: `subProperty${(property.properties || []).length + 1}`, 
                    type: 'string', 
                    required: false, 
                    properties: [] 
                  }
                ] 
              })}
              isNested={true}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyField