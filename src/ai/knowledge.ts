export interface FieldConcept {
  id: string;
  keywords: string[]; // Variations to match against
  type: string;
  label: string;
  placeholder?: string;
  validation?: {
    required?: boolean;
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
  };
  // New: Composite fields (one concept -> multiple UI fields)
  composite?: FieldConcept[]; 
}

export interface FormTemplate {
  name: string;
  keywords: string[];
  fields: string[]; // List of Field IDs or definitions
}

export const FORM_TEMPLATES: FormTemplate[] = [
  {
      name: 'User Registration',
      keywords: ['registration', 'sign up', 'create account', 'register', 'new user'],
      fields: ['name', 'email', 'password', 'terms']
  },
  {
      name: 'Login / Sign In',
      keywords: ['login', 'sign in', 'log in', 'signin'],
      fields: ['email', 'password']
  },
  {
      name: 'Contact Us',
      keywords: ['contact', 'get in touch', 'message', 'support'],
      fields: ['name', 'email', 'phone', 'comments']
  },
  {
      name: 'Checkout / Payment',
      keywords: ['checkout', 'payment', 'purchase', 'buy', 'credit card'],
      fields: ['name', 'email', 'address', 'credit_card']
  },
  {
      name: 'Job Application',
      keywords: ['job application', 'apply', 'career', 'hiring', 'resume'],
      fields: ['name', 'email', 'phone', 'website', 'address', 'comments'] // Resume could be file upload if we add it
  },
  {
      name: 'SaaS Onboarding',
      keywords: ['onboarding', 'setup', 'profile', 'workspace'],
      fields: ['company', 'role', 'size', 'website']
  }
];

export const FIELD_CONCEPTS: FieldConcept[] = [
  // --- Identity ---
  {
    id: 'name',
    keywords: ['name', 'full name', 'first name', 'who are you', 'username', 'user'],
    type: 'text',
    label: 'Full Name',
    placeholder: 'Jane Doe',
    validation: { required: true, minLength: 2 },
  },
  {
    id: 'email',
    keywords: ['email', 'email address', 'contact email', 'mail', 'login email'],
    type: 'email',
    label: 'Email Address',
    placeholder: 'name@company.com',
    validation: { required: true, pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
  },
  {
    id: 'password',
    keywords: ['password', 'pass', 'access code', 'secret'],
    type: 'password',
    label: 'Password',
    placeholder: '••••••••',
    validation: { required: true, minLength: 8 },
  },
  
  // --- Contact & Location (Composite) ---
  {
    id: 'phone',
    keywords: ['phone', 'mobile', 'telephone', 'cell', 'contact number'],
    type: 'tel',
    label: 'Phone Number',
    placeholder: '+1 (555) 000-0000',
    validation: { pattern: '^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$' },
  },
  {
    id: 'address',
    keywords: ['address', 'location', 'shipping address', 'billing address', 'residence'],
    type: 'composite', // Marker
    label: 'Address',
    composite: [
        { id: 'street', keywords: [], type: 'text', label: 'Street Address', placeholder: '123 Main St', validation: { required: true } },
        { id: 'city', keywords: [], type: 'text', label: 'City', placeholder: 'San Francisco', validation: { required: true } },
        { id: 'zip', keywords: [], type: 'text', label: 'Zip / Postal Code', placeholder: '94105', validation: { required: true } },
        { id: 'country', keywords: [], type: 'select', label: 'Country', options: ['United States', 'Canada', 'United Kingdom', 'Other'] } as any
    ]
  },

  // --- SaaS / Professional ---
  {
    id: 'company',
    keywords: ['company', 'organization', 'business name', 'workplace'],
    type: 'text',
    label: 'Company Name',
    placeholder: 'Acme Inc.',
    validation: { required: true },
  },
  {
    id: 'role',
    keywords: ['role', 'job title', 'position', 'designation'],
    type: 'text',
    label: 'Job Title',
    placeholder: 'Senior Developer',
  },
  {
    id: 'size',
    keywords: ['company size', 'team size', 'number of employees'],
    type: 'select',
    label: 'Company Size',
    options: ['1-10', '11-50', '51-200', '201-1000', '1000+']
  } as any,
  {
    id: 'website',
    keywords: ['website', 'url', 'portfolio link', 'linkedin', 'profile'],
    type: 'url',
    label: 'Website',
    placeholder: 'https://',
    validation: { pattern: '^https?://.+$' }
  },
  
  // --- Commerce ---
  {
    id: 'credit_card',
    keywords: ['credit card', 'card', 'payment', 'billing'],
    type: 'composite',
    label: 'Payment Method',
    composite: [
        { id: 'cc_num', keywords: [], type: 'text', label: 'Card Number', placeholder: '0000 0000 0000 0000', validation: { required: true, minLength: 16, maxLength: 19 } },
        { id: 'cc_exp', keywords: [], type: 'text', label: 'Expiry Date', placeholder: 'MM/YY', validation: { required: true, pattern: '^(0[1-9]|1[0-2])\\/?([0-9]{2})$' } },
        { id: 'cc_cvc', keywords: [], type: 'text', label: 'CVC', placeholder: '123', validation: { required: true, minLength: 3, maxLength: 4 } }
    ]
  },

  // --- Misc ---
  {
    id: 'terms',
    keywords: ['terms', 'agree', 'privacy policy', 'consent', 'accept'],
    type: 'checkbox',
    label: 'I agree to the Terms & Conditions',
    validation: { required: true },
  },
  {
    id: 'comments',
    keywords: ['comments', 'feedback', 'message', 'description', 'notes'],
    type: 'textarea',
    label: 'Additional Comments',
    placeholder: 'Type your message here...',
  }
];
