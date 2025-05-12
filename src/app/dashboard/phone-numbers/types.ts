export interface OutboundSettings {
  callOneNumber: boolean;
  phoneNumber?: string;
  assistantId?: string;
  squadId?: string;
  workflowId?: string;
}

export interface InboundSettings {
  enabled: boolean;
  assistantId?: string;
  squadId?: string;
  workflowId?: string;
  fallbackEnabled?: boolean;
}

export interface PhoneNumber {
  id: string;
  phone_number: string;
  name?: string;
  updated_at?: string;
  inboundSettings?: InboundSettings;
  outboundSettings?: OutboundSettings;
  configs?: PhoneNumberConfig[];
  trunk_id?: string;
  trunk_type?: 'inbound' | 'outbound';
}

export interface SipTrunkItem {
  id: string;
  phone_number: string;
  name: string;
  updated_at?: string;
  trunk_id: string;
  owner_id: string;
  description: string;
  sip_termination_uri: string;
  username: string;
  password: string;
  trunk_type: 'inbound' | 'outbound';
}

export interface PhoneNumberConfig {
  id: string;
  name: string;
  value: string;
  type: 'webhook' | 'forward' | 'voicemail' | 'menu';
  enabled: boolean;
}
