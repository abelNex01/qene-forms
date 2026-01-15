import {
  Type, AlignLeft, Hash, Mail, Lock, ChevronDown,
  CheckSquare, Circle, Calendar, Upload, Star,
  ToggleLeft, Layers, Clock, Phone, Link
} from 'lucide-react';

export const FIELD_TYPES = [
  { type: 'text', label: 'Text Input', icon: Type },
  { type: 'textarea', label: 'Text Area', icon: AlignLeft },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'password', label: 'Password', icon: Lock },
  { type: 'phone', label: 'Phone', icon: Phone },
  { type: 'url', label: 'URL', icon: Link },
  { type: 'select', label: 'Dropdown', icon: ChevronDown },
  { type: 'checkbox', label: 'Checkbox', icon: CheckSquare },
  { type: 'radio', label: 'Radio Group', icon: Circle },
  { type: 'date', label: 'Date Picker', icon: Calendar },
  { type: 'time', label: 'Time Picker', icon: Clock },
  { type: 'datetime', label: 'Date & Time', icon: Calendar },
  { type: 'file', label: 'File Upload', icon: Upload },
  { type: 'rating', label: 'Rating Stars', icon: Star },
  { type: 'toggle', label: 'Toggle Switch', icon: ToggleLeft },
  { type: 'section', label: 'Section Group', icon: Layers },
];

export const SMART_SUGGESTIONS: Record<string, { placeholder: string, validation: string, type: string }> = {
  name: { placeholder: 'Enter your full name', validation: 'required', type: 'text' },
  email: { placeholder: 'example@email.com', validation: 'email', type: 'email' },
  phone: { placeholder: '+1 (555) 123-4567', validation: 'phone', type: 'phone' },
  password: { placeholder: 'Enter a secure password', validation: 'password', type: 'password' },
  address: { placeholder: 'Street address', validation: 'required', type: 'textarea' },
  age: { placeholder: '18-100', validation: 'number', type: 'number' },
  date: { placeholder: 'Select date', validation: 'required', type: 'date' },
  website: { placeholder: 'https://example.com', validation: 'url', type: 'url' },
  comment: { placeholder: 'Leave your comment...', validation: 'none', type: 'textarea' },
  rating: { placeholder: 'Rate from 1-5', validation: 'required', type: 'rating' },
};

export const VALIDATION_RULES: Record<string, { label: string, pattern: string | null }> = {
  required: { label: 'Required', pattern: null },
  email: { label: 'Email Format', pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' },
  phone: { label: 'Phone Number', pattern: '^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$' },
  url: { label: 'URL Format', pattern: '^https?:\\/\\/.+' },
  number: { label: 'Numbers Only', pattern: '^[0-9]+$' },
  alpha: { label: 'Letters Only', pattern: '^[a-zA-Z]+$' },
  alphanumeric: { label: 'Alphanumeric', pattern: '^[a-zA-Z0-9]+$' },
  password: { label: 'Strong Password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$' },
  custom: { label: 'Custom Regex', pattern: '' },
};
