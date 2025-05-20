import React, { useState, useEffect, useRef } from 'react'
import QueryBuilder from './QueryBuilder';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface RequestBodyProperty {
  name: string;
  type: string;
  description?: string;
  required: boolean;
  properties?: RequestBodyProperty[];
}

interface RequestBodyBuilderProps {
  initialSchema?: RequestBodyProperty[];
  onSchemaChange?: (schema: RequestBodyProperty[]) => void;
}

function RequestBodyBuilder({ initialSchema = [], onSchemaChange }: RequestBodyBuilderProps) {
  const [properties, setProperties] = useState<RequestBodyProperty[]>(initialSchema);
  const [enableRequestBody, setEnableRequestBody] = useState(true);
  const [showSampleJSON, setShowSampleJSON] = useState(false);
  const isUpdatingFromProps = useRef(false);
  const lastInitialSchemaJSON = useRef<string>(JSON.stringify(initialSchema));

  useEffect(() => {
    const currentInitialSchemaJSON = JSON.stringify(initialSchema);
    
    if (currentInitialSchemaJSON !== lastInitialSchemaJSON.current) {
      lastInitialSchemaJSON.current = currentInitialSchemaJSON;
      isUpdatingFromProps.current = true;
      setProperties(initialSchema);
      
      setTimeout(() => {
        isUpdatingFromProps.current = false;
      }, 0);
    }
  }, [initialSchema]);

  const handlePropertiesChange = (newProperties: RequestBodyProperty[]) => {
    if (isUpdatingFromProps.current) return;
    
    setProperties(newProperties);
    
    if (onSchemaChange) {
      onSchemaChange(newProperties);
    }
  };

  const handleAddProperty = () => {
    const newProperties = [...properties, {
      name: `property${properties.length + 1}`,
      type: 'string',
      description: '',
      required: false,
      properties: []
    }];
    
    handlePropertiesChange(newProperties);
  }

  const generateSampleValue = (prop: RequestBodyProperty): string | number | boolean | object | null => {
    switch (prop.type) {
      case 'string':
        return prop.description || 'sample_text';
      case 'number':
        return 0;
      case 'boolean':
        return false;
      case 'object':
        if (!prop.properties?.length) return {};
        return prop.properties.reduce((acc, nestedProp) => ({
          ...acc,
          [nestedProp.name]: generateSampleValue(nestedProp)
        }), {});
      case 'array':
        return [];
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Request Body Parameters</h3>
        <div className="flex items-center space-x-2">
          <Switch 
            id="enable-request-body" 
            checked={enableRequestBody}
            onCheckedChange={setEnableRequestBody}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-red-500"
          />
          <Label htmlFor="enable-request-body" className="text-white/80">Enable Request Body</Label>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-white mb-3">API Request Body Structure</h3>
        
        <div className="mb-4 border border-white/10 rounded-md">
          <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
            <span className="text-sm text-white/80">Show Schema Templates</span>
            <svg width="20" height="20" viewBox="0 0 24 24" className="text-orange-500">
              <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        </div>
        
        <div 
          className="mb-4 border border-white/10 rounded-md"
          onClick={() => setShowSampleJSON(!showSampleJSON)}
        >
          <div className="p-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors">
            <span className="text-sm text-white/80">Show Sample JSON</span>
            <svg width="20" height="20" viewBox="0 0 24 24" className={`transform transition-transform duration-200 ${showSampleJSON ? 'rotate-180' : ''} text-orange-500`}>
              <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          
          {showSampleJSON && (
            <div className="p-4 border-t border-white/10">
              <pre className="bg-[#1A1D25]/70 text-white/80 p-4 rounded-md overflow-x-auto text-xs">
                <code>
                  {JSON.stringify(
                    properties.reduce((acc, prop) => ({
                      ...acc,
                      [prop.name]: generateSampleValue(prop)
                    }), {}),
                    null,
                    2
                  )}
                </code>
              </pre>
            </div>
          )}
        </div>
      </div>

      <div className="border border-white/10 rounded-md">
        <QueryBuilder 
          properties={properties} 
          setProperties={handlePropertiesChange} 
          handleAddProperty={handleAddProperty} 
        />
      </div>
    </div>
  );
}

export default RequestBodyBuilder;