"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, Wrench } from "lucide-react";
import { useToast } from "@/app/hooks/use-toast";
import { useFunctions, FunctionData } from "@/app/hooks/use-functions";

import FunctionSidebar from "./components/FunctionSidebar";
import FunctionConfiguration from "./components/FunctionConfiguration";

interface Header {
  id: string;
  name: string;
  value: string;
}

interface ApiFunctionData {
  id?: string;
  name: string;
  function_name: string;
  description: string;
  base_url: string;
  endpoint_path: string; 
  http_method: string;
  headers: Record<string, string>;
  parameter_schema: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
  request_template: Record<string, unknown>;
  async?: boolean;
  auth_required: boolean;
  response_mapping: Record<string, string>;
  error_mapping: Record<string, string>;
  active: boolean;
  is_public: boolean;
}

interface FunctionComponentData {
  id?: string;
  name?: string;
  functionName?: string;
  description?: string;
  url?: string;
  method?: string;
  headers?: Header[];
  parameterSchema?: {
    type: string;
    properties?: Record<string, unknown>;
    required?: string[];
  };
  requestTemplate?: Record<string, unknown>;
  async?: boolean;
  auth_required?: boolean;
  response_mapping?: Record<string, string>;
  error_mapping?: Record<string, string>;
  active?: boolean;
  is_public?: boolean;
}

export default function ToolsPage() {
  const { toast } = useToast();
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [isCreating, setIsCreating] = useState(false);

  const { 
    functions, 
    isLoading, 
    error, 
    createFunction, 
    updateFunction,
    deleteFunction
  } = useFunctions();
  
  useEffect(() => {
    if (!selectedFunction && functions?.items?.length > 0) {
      handleSelectFunction(functions.items[0].function_name);
    }
  }, [functions, selectedFunction]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load functions",
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  const availableFunctions = functions?.items?.map(func => ({
    id: func.id || func.function_name,
    name: func.name || "Unnamed Function",
    method: func.http_method || "GET",
    url: `${func.base_url}/${func.endpoint_path}` || ""
  })) || [];

  const handleSelectFunction = (id: string) => {
    setSelectedFunction(id);
    setActiveTab("basicInfo");
  };

  const selectedFunctionData = functions?.items?.find(func => 
    func.function_name === selectedFunction
  ) || null;

  const transformToComponentFormat = (apiFunction: ApiFunctionData | null): FunctionComponentData | null => {
    if (!apiFunction) return null;
    
    return {
      id: apiFunction.id,
      name: apiFunction.name,
      functionName: apiFunction.function_name,
      description: apiFunction.description,
      url: `${apiFunction.base_url}/${apiFunction.endpoint_path}`,
      method: apiFunction.http_method,
      headers: Object.entries(apiFunction.headers || {}).map(([name, value]) => ({
        id: `header-${name}`,
        name,
        value: String(value)
      })),
      parameterSchema: apiFunction.parameter_schema,
      requestTemplate: apiFunction.request_template,
      async: apiFunction.async,
      auth_required: apiFunction.auth_required,
      response_mapping: apiFunction.response_mapping,
      error_mapping: apiFunction.error_mapping,
      active: apiFunction.active,
      is_public: apiFunction.is_public
    };
  };

  const handleCreateFunction = async () => {
    setIsCreating(true);
    try {
      let randomId;
      if (typeof window !== 'undefined' && window.crypto) {
        const array = new Uint8Array(8);
        window.crypto.getRandomValues(array);
        randomId = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      } else {
        randomId = Math.random().toString(36).substring(2, 10) + 
                  Date.now().toString(36).substring(2, 10);
      }
      
      const newFunctionId = `function_${randomId}`;
      
      const newFunction = {
        name:newFunctionId,
        description: "A new function created from scratch",
        function_name: newFunctionId,
        function_description: "A new function created from scratch",
        base_url: "https://api.example.com",
        endpoint_path: "new",
        http_method: "GET",
        headers: {},
        parameter_schema: {
          type: "object",
          properties: {},
        },
        request_template: {},
        auth_required: false,
        response_mapping: { success: "status" },
        error_mapping: { "400": "Bad request format", "500": "Server error" },
        active: true,
        is_public: false
      };
      
      const result = await createFunction.mutateAsync(newFunction);
      
      if (result) {
        setSelectedFunction(newFunctionId);
        setActiveTab("basicInfo");
        toast({
          title: "Success",
          description: "New function created successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to create function",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveFunctionData = async (updatedData: FunctionComponentData) => {
    try {
      if (selectedFunction) {
        const parameterSchema = {
          type: updatedData.parameterSchema?.type || 'object',
          properties: updatedData.parameterSchema?.properties || {},
          required: updatedData.parameterSchema?.required
        };
        
        const apiData: FunctionData & { function_id: string } = {
          function_id: updatedData.id || selectedFunction,
          name: updatedData.name || '',
          description: updatedData.description || '',
          function_name: updatedData.functionName || '',
          function_description: updatedData.description || '',
          base_url: updatedData.url ? new URL(updatedData.url).origin : '',
          endpoint_path: updatedData.url ? new URL(updatedData.url).pathname.replace(/^\//, '') : '',
          http_method: updatedData.method || 'GET',
          headers: updatedData.headers?.reduce((obj: Record<string, string>, header: Header) => {
            obj[header.name] = header.value;
            return obj;
          }, {}) || {},
          parameter_schema: parameterSchema,
          request_template: updatedData.requestTemplate || {},
          auth_required: updatedData.auth_required || false,
          response_mapping: updatedData.response_mapping || { success: "status" },
          error_mapping: updatedData.error_mapping || { "400": "Bad request format", "500": "Server error" },
          active: updatedData.active !== undefined ? updatedData.active : true,
          is_public: updatedData.is_public || false
        };
        
        await updateFunction.mutateAsync(apiData);
        
        toast({
          title: "Success",
          description: "Function updated successfully",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to update function",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFunction = async (functionId: string) => {
    try {
      await deleteFunction.mutateAsync(functionId);
      
      const deletedFunction = functions?.items?.find(f => f.id === functionId || f.function_name === functionId);
      if (deletedFunction && selectedFunction === deletedFunction.function_name) {
        const otherFunction = functions?.items?.find(f => f.function_name !== deletedFunction.function_name);
        if (otherFunction) {
          setSelectedFunction(otherFunction.function_name);
        } else {
          setSelectedFunction(null);
        }
      }
      
      toast({
        title: "Success",
        description: "Function deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete function",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid grid-cols-[350px_1fr]">
      <FunctionSidebar 
        functions={availableFunctions}
        selectedFunction={selectedFunction}
        onSelectFunction={handleSelectFunction}
        onDeleteFunction={handleDeleteFunction}
        onCreateFunction={handleCreateFunction}
        isCreating={isCreating || createFunction.isPending}
        isLoading={isLoading}
      />
      
      <div className="p-8 backdrop-blur-xl bg-[#1A1D25]/70 rounded-lg">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-[#F97316]/40 to-[#EF4444]/30 blur-[100px] rounded-full"></div>
        </div>

        <div className="relative z-10">
          {isLoading ? (
            <div className="flex items-center justify-center h-96 text-white/60">
              Loading function details...
            </div>
          ) : availableFunctions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 flex items-center justify-center mb-4">
                <Wrench className="w-8 h-8 text-orange-500" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">No Functions Available</h2>
              <p className="text-white/60 max-w-md mb-6 text-sm">
                Create a new function to define API endpoints that your voice agents can call.
                Functions allow agents to interact with external services and databases.
              </p>
              <Button
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 border-none px-4 py-2 h-auto text-base"
                onClick={handleCreateFunction}
                disabled={isCreating || createFunction.isPending}
              >
                {(isCreating || createFunction.isPending) ? (
                  <>Creating...</>
                ) : (
                  <>
                    <PlusIcon className="h-4 w-4" />
                    Create New Function
                  </>
                )}
              </Button>
            </div>
          ) : (
            <FunctionConfiguration 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              functionData={transformToComponentFormat(selectedFunctionData)}
              onSave={handleSaveFunctionData}
            />
          )}
        </div>
      </div>
    </div>
  );
} 