import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, Save, Wrench, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import RequestBodyBuilder, { RequestBodyProperty } from "./RequestBodyBuilder";

interface ParameterSchema {
  type: string;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
}

interface SchemaProperty {
  type?: string;
  description?: string;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  items?: SchemaProperty;
}

interface FunctionData {
  id?: string;
  name?: string;
  functionName?: string;
  description?: string;
  url?: string;
  method?: string;
  headers?: Header[];
  parameterSchema?: ParameterSchema;
  requestTemplate?: Record<string, unknown>;
  async?: boolean;
  auth_required?: boolean;
  response_mapping?: Record<string, string>;
  error_mapping?: Record<string, string>;
  active?: boolean;
  is_public?: boolean;
}

interface FunctionConfigurationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  functionData?: FunctionData | null;
  onSave?: (updatedData: FunctionData) => void;
}

interface Header {
  id: string;
  name: string;
  value: string;
}

export default function FunctionConfiguration({
  activeTab,
  setActiveTab,
  functionData,
  onSave
}: FunctionConfigurationProps) {
  const [functionState, setFunctionState] = useState<FunctionData>({
    name: "",
    functionName: "",
    description: "",
    url: "",
    method: "GET",
    headers: [],
    parameterSchema: {
      type: "object",
      properties: {},
      required: []
    },
    requestTemplate: {},
    async: false,
    auth_required: false,
    response_mapping: { success: "status" },
    error_mapping: { "400": "Bad request format", "500": "Server error" },
    active: true,
    is_public: false
  });
  
  const [newHeaderName, setNewHeaderName] = useState("");
  const [newHeaderValue, setNewHeaderValue] = useState("");
  const [currentBuilderSchema, setCurrentBuilderSchema] = useState<RequestBodyProperty[]>([]);
  const initialSchemaRef = useRef<RequestBodyProperty[]>([]);
  const hasInitialized = useRef(false);
  
  const [newErrorCode, setNewErrorCode] = useState("");
  const [newErrorMessage, setNewErrorMessage] = useState("");
  useEffect(() => {
    if (functionData) {
      setFunctionState({
        id: functionData.id || "",
        name: functionData.name || "",
        functionName: functionData.functionName || "",
        description: functionData.description || "",
        url: functionData.url || "",
        method: functionData.method || "GET",
        headers: functionData.headers || [],
        parameterSchema: functionData.parameterSchema || {
          type: "object",
          properties: {},
          required: []
        },
        requestTemplate: functionData.requestTemplate || {},
        async: functionData.async || false,
        auth_required: functionData.auth_required || false,
        response_mapping: functionData.response_mapping || { success: "status" },
        error_mapping: functionData.error_mapping || { "400": "Bad request format", "500": "Server error" },
        active: functionData.active !== undefined ? functionData.active : true,
        is_public: functionData.is_public || false
      });
      
      if (functionData.parameterSchema?.properties) {
        const initialSchema = Object.entries(functionData.parameterSchema.properties).map(
          ([name, schema]: [string, SchemaProperty]) => ({
            name,
            type: schema.type || 'string',
            description: schema.description || '',
            required: functionData.parameterSchema?.required?.includes(name) || false,
            properties: []
          })
        );
        initialSchemaRef.current = initialSchema;
        setCurrentBuilderSchema(initialSchema);
      } else {
        initialSchemaRef.current = [];
        setCurrentBuilderSchema([]);
      }
      
      hasInitialized.current = true;
    }
  }, [functionData]);

  const tabs = [
    { id: "basicInfo", label: "Basic Info" },
    { id: "apiParameters", label: "API Parameters" },
    { id: "requestBody", label: "Request Body" },
    { id: "advancedSettings", label: "Advanced Settings" },
    { id: "testPreview", label: "Test & Preview" }
  ];


  const updateField = (field: keyof FunctionData, value: unknown) => {
    setFunctionState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addHeader = () => {
    const newHeader = {
      id: Date.now().toString(),
      name: newHeaderName.trim(),
      value: newHeaderValue.trim()
    };
    
    const updatedHeaders = [...(functionState.headers || []), newHeader];
    updateField('headers', updatedHeaders);
    
    setNewHeaderName("");
    setNewHeaderValue("");
  };

  const removeHeader = (id: string) => {
    const updatedHeaders = (functionState.headers || []).filter(header => header.id !== id);
    updateField('headers', updatedHeaders);
  };

  const convertPropertiesToSchema = (properties: RequestBodyProperty[]): Record<string, SchemaProperty> => {
    return properties.reduce((result, prop) => {
      const schemaProperty: SchemaProperty = {
        type: prop.type,
      };

      if (prop.description) {
        schemaProperty.description = prop.description;
      }
      if (prop.type === 'object' && prop.properties && prop.properties.length > 0) {
        schemaProperty.properties = convertPropertiesToSchema(prop.properties);
        const requiredFields = prop.properties
          .filter(subProp => subProp.required)
          .map(subProp => subProp.name);

        if (requiredFields.length > 0) {
          schemaProperty.required = requiredFields;
        }
      }

      if (prop.type === 'array' && prop.properties && prop.properties.length > 0) {
        const firstProp = prop.properties[0];
        schemaProperty.items = {
          type: firstProp.type
        };

        if (firstProp.description) {
          schemaProperty.items.description = firstProp.description;
        }

        if (firstProp.type === 'object' && firstProp.properties && firstProp.properties.length > 0) {
          schemaProperty.items.properties = convertPropertiesToSchema(firstProp.properties);

          const requiredFields = firstProp.properties
            .filter(subProp => subProp.required)
            .map(subProp => subProp.name);

          if (requiredFields.length > 0) {
            schemaProperty.items.required = requiredFields;
          }
        }
      }

      result[prop.name] = schemaProperty;
      return result;
    }, {} as Record<string, SchemaProperty>);
  };

  const handleSchemaChange = (properties: RequestBodyProperty[]) => {
    setCurrentBuilderSchema(properties);

    // Get required field names
    const requiredFields = properties
      .filter(prop => prop.required)
      .map(prop => prop.name);

    // Convert properties to schema format
    const propertiesSchema = convertPropertiesToSchema(properties);

    // Create updated parameter schema
    const updatedSchema: ParameterSchema = {
      type: 'object',
      properties: propertiesSchema,
      required: requiredFields.length > 0 ? requiredFields : undefined
    };

    // Update the centralized state
    updateField('parameterSchema', updatedSchema);
  };
  
  // Save all changes
  const handleSave = () => {
    if (onSave) {
      // Convert headers from array of objects with id to object of key-value pairs
      const headersObject = functionState.headers?.reduce((obj, header) => {
        obj[header.name] = header.value;
        return obj;
      }, {} as Record<string, string>) || {};

      // Split the URL into base_url and endpoint_path
      let base_url = '';
      let endpoint_path = '';
      
      if (functionState.url) {
        const url = new URL(functionState.url);
        base_url = `${url.protocol}//${url.hostname}`;
        endpoint_path = url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname;
      }

      // Format the data according to the required schema
      const formattedData = {
        id: functionState.id,
        name: functionState.name,
        description: functionState.description,
        base_url,
        endpoint_path,
        function_name: functionState.functionName,
        function_description: functionState.description, 
        http_method: functionState.method,
        headers: headersObject,
        parameter_schema: functionState.parameterSchema,
        request_template: functionState.requestTemplate,
        auth_required: functionState.auth_required || false,
        response_mapping: functionState.response_mapping || { success: "status" },
        error_mapping: functionState.error_mapping || { 
          "400": "Bad request format", 
          "500": "Server error in Make.com" 
        },
        active: functionState.active !== undefined ? functionState.active : true,
        is_public: functionState.is_public || false
      };

      console.log("Formatted data for API:", formattedData);
      const internalFormat = {
        ...functionState,
      };

      onSave(internalFormat);
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-xl font-medium text-white">Function Configuration</h2>
        <Button 
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 transition-all"
          onClick={handleSave}
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="border-b border-white/10">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 text-sm font-medium",
                activeTab === tab.id
                  ? "text-[#F97316] border-b-2 border-[#F97316]"
                  : "text-white/60 hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto content-scroll">
        <style jsx global>{`
          .content-scroll::-webkit-scrollbar {
            width: 6px;
          }
          
          .content-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .content-scroll::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
          }

          .content-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }

          /* For Firefox */
          .content-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
          }
        `}</style>

        {activeTab === "basicInfo" && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
              <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Basic Function Information
              </h4>
              <p className="text-sm text-white/60 mb-6">Define how the LLM will understand and use this function</p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white/80">Display Name</Label>
                  <Input
                    id="name"
                    placeholder="Add Patient Record"
                    value={functionState.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="mt-1 bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:ring-orange-500/20"
                  />
                  <p className="text-xs text-white/40 mt-1">Human-readable name for this function</p>
                </div>

                <div>
                  <Label htmlFor="functionName" className="text-white/80">Function Name</Label>
                  <Input
                    id="functionName"
                    placeholder="new_blank_function"
                    value={functionState.functionName}
                    onChange={(e) => updateField('functionName', e.target.value)}
                    className="mt-1 bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:ring-orange-500/20"
                  />
                  <p className="text-xs text-white/40 mt-1">Between 5 and 100 characters, alphanumeric with underscores</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="requestType" className="text-white/80">Request Type</Label>
                    <select
                      id="requestType"
                      value={functionState.method}
                      onChange={(e) => updateField('method', e.target.value)}
                      className="mt-1 flex h-10 w-full rounded-md border border-white/10 bg-[#1A1D25]/70 px-3 py-2 text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <div className="flex items-center space-x-2 h-10">
                      <Switch
                        id="async-mode"
                        checked={!!functionState.async}
                        onCheckedChange={(checked) => updateField('async', checked)}
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-red-500"
                      />
                      <Label htmlFor="async-mode" className="text-white/80">Async</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="url" className="text-white/80">URL</Label>
                  <Input
                    id="url"
                    placeholder="https://api.example.com/new"
                    value={functionState.url}
                    onChange={(e) => updateField('url', e.target.value)}
                    className="mt-1 bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:ring-orange-500/20"
                  />
                  <p className="text-xs text-white/40 mt-1">Complete URL with path parameter placeholders (e.g., https://api.example.com/users/{'id'})</p>
                </div>

                <div>
                  <Label htmlFor="description" className="text-white/80">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="A new function starting from scratch."
                    value={functionState.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    className="mt-1 min-h-[100px] bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:ring-orange-500/20"
                  />
                  <p className="text-xs text-white/40 mt-1">Describe what this function does and when it should be used (10-500 chars)</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
              <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Request Headers
              </h4>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-white/80">Headers</h4>
                <Button
                  onClick={addHeader}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-white/10 text-white/80 hover:text-white hover:bg-white/10"
                >
                  <PlusIcon className="h-3 w-3" />
                  Add Header
                </Button>
              </div>
              <p className="text-sm text-white/60 mb-4">Add custom headers to be sent with the request, like Authentication tokens</p>

              <div className="space-y-4">
                {functionState.headers?.map((header) => (
                  <div key={header.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                    <Input
                      value={header.name}
                      onChange={(e) => updateField('headers', (functionState.headers || []).map(h => h.id === header.id ? { ...h, name: e.target.value } : h))}
                      className="bg-[#1A1D25]/70 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
                      placeholder="Header Name"
                    />
                    <Input
                      value={header.value}
                      onChange={(e) => updateField('headers', (functionState.headers || []).map(h => h.id === header.id ? { ...h, value: e.target.value } : h))}
                      className="bg-[#1A1D25]/70 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
                      placeholder="Value"
                    />
                    <Button
                      onClick={() => removeHeader(header.id)}
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mt-2">
                  <Input
                    value={newHeaderName}
                    onChange={(e) => setNewHeaderName(e.target.value)}
                    className="bg-[#1A1D25]/70 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
                    placeholder="New Header Name"
                  />
                  <Input
                    value={newHeaderValue}
                    onChange={(e) => setNewHeaderValue(e.target.value)}
                    className="bg-[#1A1D25]/70 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
                    placeholder="Value"
                  />
                  <Button
                    onClick={addHeader}
                    variant="ghost"
                    size="icon"
                    className="text-green-400 hover:text-green-500 hover:bg-green-500/10"
                    disabled={!newHeaderName.trim() || !newHeaderValue.trim()}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "apiParameters" && (
          <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
            <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              API Parameters
            </h4>
            <p className="text-sm text-white/60 mb-6">Configure the parameters for this API endpoint</p>

            {functionState.parameterSchema && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-white mb-2">Required Parameters</h3>
                  <div className="flex flex-wrap gap-2">
                    {functionState.parameterSchema.required?.map((param: string) => (
                      <div key={param} className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-xs text-orange-300">
                        {param}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "requestBody" && (
          <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
            <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Request Body
            </h4>

            <RequestBodyBuilder
              initialSchema={currentBuilderSchema}
              onSchemaChange={handleSchemaChange}
            />

            {functionState.parameterSchema && (
              <div className="mt-6 p-4 rounded-md border border-white/10 bg-white/5">
                <h3 className="text-sm font-medium text-white mb-2">Generated Parameter Schema</h3>
                <p className="text-xs text-white/60 mb-3">This schema will be used for the API request body</p>
                <pre className="text-xs text-white/70 overflow-auto max-h-[200px] p-2 bg-black/20 rounded">
                  {JSON.stringify(functionState.parameterSchema, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {activeTab === "advancedSettings" && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
              <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Function Status
              </h4>
              <p className="text-sm text-white/60 mb-6">Configure the status and visibility of this function</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="active" className="text-white/80">Active Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={!!functionState.active}
                      onCheckedChange={(checked) => updateField('active', checked)}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-red-500"
                    />
                    <Label htmlFor="active" className="text-white/80">{functionState.active ? "Active" : "Inactive"}</Label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_public" className="text-white/80">Public Availability</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_public"
                      checked={!!functionState.is_public}
                      onCheckedChange={(checked) => updateField('is_public', checked)}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-red-500"
                    />
                    <Label htmlFor="is_public" className="text-white/80">{functionState.is_public ? "Public" : "Private"}</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
              <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Authentication Settings
              </h4>
              <p className="text-sm text-white/60 mb-6">Configure authentication requirements for this function</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auth_required" className="text-white/80">Authentication Required</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auth_required"
                      checked={!!functionState.auth_required}
                      onCheckedChange={(checked) => updateField('auth_required', checked)}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-red-500"
                    />
                    <Label htmlFor="auth_required" className="text-white/80">{functionState.auth_required ? "Required" : "Not Required"}</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
              <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Response Mapping
              </h4>
              <p className="text-sm text-white/60 mb-6">Define how to map API responses to your function results</p>

              <div className="space-y-4">
                {Object.entries(functionState.response_mapping || {}).map(([key, value], index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                    <Input
                      value={key}
                      onChange={(e) => {
                        const newMapping = { ...functionState.response_mapping };
                        const oldKey = key;
                        delete newMapping[oldKey];
                        newMapping[e.target.value] = value;
                        updateField('response_mapping', newMapping);
                      }}
                      className="bg-[#1A1D25]/70 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
                      placeholder="Key (e.g. success)"
                    />
                    <Input
                      value={value}
                      onChange={(e) => {
                        const newMapping = { ...functionState.response_mapping };
                        newMapping[key] = e.target.value;
                        updateField('response_mapping', newMapping);
                      }}
                      className="bg-[#1A1D25]/70 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
                      placeholder="Value (e.g. status)"
                    />
                    <Button
                      onClick={() => {
                        const newMapping = { ...functionState.response_mapping };
                        delete newMapping[key];
                        updateField('response_mapping', newMapping);
                      }}
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  onClick={() => {
                    const newMapping = { ...functionState.response_mapping, '': '' };
                    updateField('response_mapping', newMapping);
                  }}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-white/10 text-white/80 hover:text-white hover:bg-white/10"
                >
                  <PlusIcon className="h-3 w-3" />
                  Add Response Mapping
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
              <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Error Mapping
              </h4>
              <p className="text-sm text-white/60 mb-6">Define error messages for different HTTP status codes</p>

              <div className="space-y-4">
                {Object.entries(functionState.error_mapping || {}).map(([code, message], index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                    <Input
                      value={code}
                      onChange={(e) => {
                        const newMapping = { ...functionState.error_mapping };
                        const oldCode = code;
                        delete newMapping[oldCode];
                        newMapping[e.target.value] = message;
                        updateField('error_mapping', newMapping);
                      }}
                      className="bg-[#1A1D25]/70 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
                      placeholder="Status Code (e.g. 400)"
                    />
                    <Input
                      value={message}
                      onChange={(e) => {
                        const newMapping = { ...functionState.error_mapping };
                        newMapping[code] = e.target.value;
                        updateField('error_mapping', newMapping);
                      }}
                      className="bg-[#1A1D25]/70 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
                      placeholder="Error Message"
                    />
                    <Button
                      onClick={() => {
                        const newMapping = { ...functionState.error_mapping };
                        delete newMapping[code];
                        updateField('error_mapping', newMapping);
                      }}
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mt-2">
                  <Input
                    value={newErrorCode}
                    onChange={(e) => setNewErrorCode(e.target.value)}
                    className="bg-[#1A1D25]/70 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
                    placeholder="Status Code (e.g. 404)"
                  />
                  <Input
                    value={newErrorMessage}
                    onChange={(e) => setNewErrorMessage(e.target.value)}
                    className="bg-[#1A1D25]/70 border-white/10 text-white focus:border-orange-500/50 focus:ring-orange-500/20"
                    placeholder="Error Message"
                  />
                  <Button
                    onClick={() => {
                      if (newErrorCode.trim() && newErrorMessage.trim()) {
                        const newMapping = { ...functionState.error_mapping, [newErrorCode.trim()]: newErrorMessage.trim() };
                        updateField('error_mapping', newMapping);
                        setNewErrorCode('');
                        setNewErrorMessage('');
                      }
                    }}
                    variant="ghost"
                    size="icon"
                    className="text-green-400 hover:text-green-500 hover:bg-green-500/10"
                    disabled={!newErrorCode.trim() || !newErrorMessage.trim()}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "testPreview" && (
          <div className="p-4 rounded-lg bg-gradient-to-br from-[#1A1D25]/80 to-[#1A1D25]/60 border border-white/10">
            <h4 className="text-sm font-medium text-orange-400 mb-4 flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Test & Preview
            </h4>
            <p className="text-sm text-white/60 mb-6">Test your function by providing parameter values</p>

            <div className="space-y-4">
              {functionState.parameterSchema?.properties && Object.keys(functionState.parameterSchema.properties).length > 0 && (
                <div className="p-4 rounded-lg bg-[#1A1D25]/50 border border-white/10">
                  <h3 className="text-sm font-medium text-white mb-4">Test Parameters</h3>
                  
                  {Object.entries(functionState.parameterSchema.properties).map(([name, schema]: [string, SchemaProperty]) => (
                    <div key={name} className="mb-3">
                      <Label htmlFor={`param-${name}`} className="text-white/80">
                        {name}
                        {functionState.parameterSchema?.required?.includes(name) && (
                          <span className="ml-2 text-xs text-orange-500">required</span>
                        )}
                      </Label>
                      <Input 
                        id={`param-${name}`}
                        placeholder={schema.description || name}
                        className="mt-1 bg-[#1A1D25]/70 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50 focus:ring-orange-500/20"
                      />
                      {schema.description && (
                        <p className="text-xs text-white/40 mt-1">{schema.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 transition-all">
                Test Function
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const PropertyVisualization = ({ name, schema, required, level = 0 }: { name: string, schema: SchemaProperty, required?: boolean, level: number }) => {
  const isObject = schema.type === 'object';
  const isArray = schema.type === 'array';

  return (
    <div className={`${level > 0 ? 'ml-4 mt-2 pl-2 border-l border-white/10' : ''}`}>
      <div className="flex items-center space-x-2">
        <span className="text-white/80">{name}:</span>
        <span className={`px-2 py-1 text-xs ${isObject ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : isArray ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'} border rounded`}>
          {schema.type || "string"}
        </span>
        {required && (
          <span className="text-xs text-orange-500">required</span>
        )}
      </div>

      {isObject && schema.properties && (
        <div className="mt-1">
          {Object.entries(schema.properties).map(([propName, propSchema]: [string, SchemaProperty]) => (
            <PropertyVisualization
              key={`${name}.${propName}`}
              name={propName}
              schema={propSchema}
              required={schema.required?.includes(propName)}
              level={level + 1}
            />
          ))}
        </div>
      )}

      {isArray && schema.items && (
        <div className="mt-1 ml-4 pl-2 border-l border-white/10">
          <div className="flex items-center space-x-2">
            <span className="text-white/80">items:</span>
            <span className={`px-2 py-1 text-xs ${schema.items.type === 'object' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'} border rounded`}>
              {schema.items.type || "string"}
            </span>
          </div>

          {schema.items.type === 'object' && schema.items.properties && (
            <div className="mt-1">
              {Object.entries(schema.items.properties).map(([propName, propSchema]: [string, SchemaProperty]) => (
                <PropertyVisualization
                  key={`${name}.items.${propName}`}
                  name={propName}
                  schema={propSchema}
                  required={schema.items.required?.includes(propName)}
                  level={level + 2}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 