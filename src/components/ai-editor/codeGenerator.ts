/* eslint-disable @typescript-eslint/no-explicit-any */
export class CodeGenerator {
  private fields: any[];
  private title: string;
  private description: string;

  constructor(fields: any[], title: string, description: string) {
    this.fields = fields;
    this.title = title || 'Untitled Form';
    this.description = description || '';
  }

  generate(options: { framework: string; styling: string; language?: string }): string {
    const { framework, styling, language } = options;

    switch (framework) {
      case 'react':
        return this.generateReact(styling, language === 'ts');
      case 'next':
        return this.generateNext(styling);
      case 'vue':
        return this.generateVue(styling);
      case 'svelte':
        return this.generateSvelte(styling);
      case 'angular':
        return this.generateAngular(styling);
      case 'php':
        return this.generatePHP(styling);
      case 'html':
      default:
        return this.generateHTML(styling);
    }
  }

  private generateHTML(styling: string): string {
    const isTailwind = styling === 'tailwind';
    
    const formFields = this.fields.map(field => {
      const fieldId = `field_${field.id}`;
      const labelClass = isTailwind ? "block text-sm font-medium text-gray-700 mb-1" : "";
      const inputClass = isTailwind 
        ? "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
        : "form-input";
      
      let inputElement = '';
      
      switch (field.type) {
        case 'textarea':
          inputElement = `<textarea id="${fieldId}" name="${field.id}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''} class="${inputClass}"></textarea>`;
          break;
        case 'select':
          inputElement = `<select id="${fieldId}" name="${field.id}" class="${inputClass}">
            ${field.options.map((opt: string) => `<option value="${opt}">${opt}</option>`).join('\n            ')}
          </select>`;
          break;
        case 'radio':
          inputElement = field.options.map((opt: string) => `
            <div class="${isTailwind ? 'flex items-center' : ''}">
              <input type="radio" id="${fieldId}_${opt}" name="${field.id}" value="${opt}" class="${isTailwind ? 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300' : ''}">
              <label for="${fieldId}_${opt}" class="${isTailwind ? 'ml-2 block text-sm text-gray-700' : ''}">${opt}</label>
            </div>`).join('');
          break;
        case 'checkbox':
          inputElement = `
            <div class="${isTailwind ? 'flex items-center' : ''}">
              <input type="checkbox" id="${fieldId}" name="${field.id}" ${field.required ? 'required' : ''} class="${isTailwind ? 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded' : ''}">
              <label for="${fieldId}" class="${isTailwind ? 'ml-2 block text-sm text-gray-700' : ''}">${field.label}</label>
            </div>`;
          break;
        case 'file':
          inputElement = `<input type="file" id="${fieldId}" name="${field.id}" accept="${field.accept || '*'}" ${field.required ? 'required' : ''} class="${inputClass}">`;
          break;
        default:
          inputElement = `<input type="${field.type}" id="${fieldId}" name="${field.id}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''} class="${inputClass}">`;
      }

      return `
        <div class="${isTailwind ? 'mb-4' : 'form-group'}">
          ${field.type !== 'checkbox' ? `<label for="${fieldId}" class="${labelClass}">${field.label}</label>` : ''}
          ${inputElement}
        </div>`;
    }).join('');

    const styles = isTailwind 
      ? '<script src="https://cdn.tailwindcss.com"></script>' 
      : `
<style>
  body { font-family: system-ui, -apple-system, sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto; line-height: 1.5; color: #333; }
  .form-group { margin-bottom: 1rem; }
  label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
  .form-input { width: 100%; padding: 0.5rem; border: 1px solid #ccc; rounded: 0.25rem; }
  .btn { background: #3b82f6; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.25rem; cursor: pointer; font-weight: 600; }
  .btn:hover { background: #2563eb; }
</style>`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.title}</title>
    ${styles}
</head>
<body class="${isTailwind ? 'bg-gray-50 min-h-screen p-8' : ''}">
    <div class="${isTailwind ? 'max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg' : ''}">
        <h1 class="${isTailwind ? 'text-2xl font-bold mb-2' : ''}">${this.title}</h1>
        <p class="${isTailwind ? 'text-gray-600 mb-8' : ''}">${this.description}</p>
        
        <form action="#" method="POST">
            ${formFields}
            <div class="${isTailwind ? 'mt-6' : ''}">
                <button type="submit" class="${isTailwind ? 'w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium' : 'btn'}">
                    Submit
                </button>
            </div>
        </form>
    </div>
</body>
</html>`;
  }

  private generateReact(styling: string, isTS: boolean): string {
    const isTailwind = styling === 'tailwind';
    
    // Import validation generator logic (simulated for code generation output string)
    // We construct the validation schema string here manually or use the helper if we can import it.
    // For the export FILE content, we need to embed the schema string.
    
    let zodSchema = '';
    let zodImport = '';
    let hookFormImport = '';
    
    if (isTS) {
        zodImport = `import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';`;
        
        // Generate Zod Schema
        const schemaFields = this.fields.map(f => {
            let rule = 'z.string()';
            if (f.type === 'email') rule += '.email()';
            if (f.type === 'number') rule = 'z.number()';
            if (f.type === 'checkbox') rule = 'z.boolean()';
            if (f.required) {
               if (f.type === 'string' || f.type === 'email' || f.type === 'textarea') rule += `.min(1, "${f.label} is required")`;
            } else {
               rule += '.optional()';
            }
            return `  ${f.label.toLowerCase().replace(/[^a-z0-9]/g, '_')}: ${rule}`;
        }).join(',\n');
        
        zodSchema = `
const formSchema = z.object({
${schemaFields}
});

type FormData = z.infer<typeof formSchema>;
`;
    }

    const fieldsJSX = this.fields.map(field => {
      const fieldId = `field_${field.id}`;
      const fieldKey = field.label.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const labelClass = isTailwind ? "block text-sm font-medium text-gray-700 mb-1" : "";
      const inputClass = isTailwind 
        ? "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
        : "form-input";
        
      const errorDisplay = isTS 
        ? `{errors.${fieldKey} && <p className="text-red-500 text-xs mt-1">{errors.${fieldKey}?.message}</p>}` 
        : '';
      
      let inputElement = '';
      const registerProps = isTS ? `{...register('${fieldKey}')}` : `name="${fieldKey}" onChange={handleChange} value={formData.${fieldKey} || ''}`;
      
      switch (field.type) {
        case 'textarea':
          inputElement = `<textarea id="${fieldId}" placeholder="${field.placeholder}" className="${inputClass}" ${registerProps} />`;
          break;
        case 'select':
          inputElement = `<select id="${fieldId}" className="${inputClass}" ${registerProps}>
            ${field.options.map((opt: string) => `<option key="${opt}" value="${opt}">${opt}</option>`).join('\n              ')}
          </select>`;
          break;
        case 'checkbox':
          inputElement = `
            <div className="${isTailwind ? 'flex items-center' : ''}">
              <input type="checkbox" id="${fieldId}" className="${isTailwind ? 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded' : ''}" ${registerProps} />
              <label htmlFor="${fieldId}" className="${isTailwind ? 'ml-2 block text-sm text-gray-700' : ''}">${field.label}</label>
            </div>`;
          break;
        default:
          inputElement = `<input type="${field.type}" id="${fieldId}" placeholder="${field.placeholder}" className="${inputClass}" ${registerProps} />`;
      }

      return `
        <div className="${isTailwind ? 'mb-4' : 'form-group'}">
          ${field.type !== 'checkbox' ? `<label htmlFor="${fieldId}" className="${labelClass}">${field.label}</label>` : ''}
          ${inputElement}
          ${errorDisplay}
        </div>`;
    }).join('');

    if (isTS) {
        return `import React from 'react';
${zodImport}

${zodSchema}

const ${this.title.replace(/\s+/g, '')}Form = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Submitted!');
  };

  return (
    <div className="${isTailwind ? 'max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200' : 'form-container'}">
      <h1 className="${isTailwind ? 'text-2xl font-bold mb-2' : ''}">${this.title}</h1>
      <p className="${isTailwind ? 'text-gray-600 mb-8' : ''}">${this.description}</p>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        ${fieldsJSX}
        <div className="${isTailwind ? 'mt-6' : ''}">
          <button type="submit" disabled={isSubmitting} className="${isTailwind ? 'w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50' : 'btn'}">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ${this.title.replace(/\s+/g, '')}Form;`;
    }

    // Default React JS implementation (Simple state)
    return `import React, { useState } from 'react';

const ${this.title.replace(/\s+/g, '')}Form = () => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };

  return (
    <div className="${isTailwind ? 'max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200' : 'form-container'}">
      <h1 className="${isTailwind ? 'text-2xl font-bold mb-2' : ''}">${this.title}</h1>
      <p className="${isTailwind ? 'text-gray-600 mb-8' : ''}">${this.description}</p>
      
      <form onSubmit={handleSubmit}>
        ${fieldsJSX}
        <div className="${isTailwind ? 'mt-6' : ''}">
          <button type="submit" className="${isTailwind ? 'w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium border-none cursor-pointer' : 'btn'}">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ${this.title.replace(/\s+/g, '')}Form;`;
  }

  private generateNext(styling: string): string {
    const reactCode = this.generateReact(styling, true);
    return `'use client';\n\n${reactCode}`;
  }

  private generateVue(styling: string): string {
    const isTailwind = styling === 'tailwind';
    
    const formFields = this.fields.map(field => {
      const fieldId = `field_${field.id}`;
      const labelClass = isTailwind ? "block text-sm font-medium text-gray-700 mb-1" : "";
      const inputClass = isTailwind 
        ? "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
        : "form-input";
      
      let inputElement = '';
      
      switch (field.type) {
        case 'textarea':
          inputElement = `<textarea id="${fieldId}" name="${field.id}" placeholder="${field.placeholder}" :required="${field.required}" class="${inputClass}" v-model="formData['${field.id}']"></textarea>`;
          break;
        case 'select':
          inputElement = `<select id="${fieldId}" name="${field.id}" class="${inputClass}" v-model="formData['${field.id}']">
            ${field.options.map((opt: string) => `<option value="${opt}">${opt}</option>`).join('\n            ')}
          </select>`;
          break;
        case 'radio':
          inputElement = field.options.map((opt: string) => `
            <div class="${isTailwind ? 'flex items-center' : ''}">
              <input type="radio" id="${fieldId}_${opt}" name="${field.id}" value="${opt}" v-model="formData['${field.id}']" class="${isTailwind ? 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300' : ''}">
              <label for="${fieldId}_${opt}" class="${isTailwind ? 'ml-2 block text-sm text-gray-700' : ''}">${opt}</label>
            </div>`).join('');
          break;
        case 'checkbox':
          inputElement = `
            <div class="${isTailwind ? 'flex items-center' : ''}">
              <input type="checkbox" id="${fieldId}" name="${field.id}" :required="${field.required}" v-model="formData['${field.id}']" class="${isTailwind ? 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded' : ''}">
              <label for="${fieldId}" class="${isTailwind ? 'ml-2 block text-sm text-gray-700' : ''}">${field.label}</label>
            </div>`;
          break;
        default:
          inputElement = `<input type="${field.type}" id="${fieldId}" name="${field.id}" placeholder="${field.placeholder}" :required="${field.required}" class="${inputClass}" v-model="formData['${field.id}']">`;
      }

      return `
      <div class="${isTailwind ? 'mb-4' : 'form-group'}">
        ${field.type !== 'checkbox' ? `<label for="${fieldId}" class="${labelClass}">${field.label}</label>` : ''}
        ${inputElement}
      </div>`;
    }).join('');

    return `<template>
  <div class="${isTailwind ? 'max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200' : 'form-container'}">
    <h1 class="${isTailwind ? 'text-2xl font-bold mb-2' : ''}">${this.title}</h1>
    <p class="${isTailwind ? 'text-gray-600 mb-8' : ''}">${this.description}</p>
    
    <form @submit.prevent="handleSubmit">
      ${formFields}
      <div class="${isTailwind ? 'mt-6' : ''}">
        <button type="submit" class="${isTailwind ? 'w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium border-none cursor-pointer' : 'btn'}">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const formData = reactive({});

const handleSubmit = () => {
  console.log('Form submitted:', formData);
  alert('Form submitted successfully!');
};
</script>`;
  }

  private generateSvelte(styling: string): string {
    const isTailwind = styling === 'tailwind';
    
    const formFields = this.fields.map(field => {
      const fieldId = `field_${field.id}`;
      const labelClass = isTailwind ? "block text-sm font-medium text-gray-700 mb-1" : "";
      const inputClass = isTailwind 
        ? "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
        : "form-input";
      
      let inputElement = '';
      
      switch (field.type) {
        case 'textarea':
          inputElement = `<textarea id="${fieldId}" name="${field.id}" placeholder="${field.placeholder}" required={${field.required}} class="${inputClass}" bind:value={formData['${field.id}']}></textarea>`;
          break;
        case 'select':
          inputElement = `<select id="${fieldId}" name="${field.id}" class="${inputClass}" bind:value={formData['${field.id}']}>
            ${field.options.map((opt: string) => `<option value="${opt}">${opt}</option>`).join('\n            ')}
          </select>`;
          break;
        case 'radio':
          inputElement = field.options.map((opt: string) => `
            <div class="${isTailwind ? 'flex items-center' : ''}">
              <input type="radio" id="${fieldId}_${opt}" name="${field.id}" value="${opt}" bind:group={formData['${field.id}']} class="${isTailwind ? 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300' : ''}">
              <label for="${fieldId}_${opt}" class="${isTailwind ? 'ml-2 block text-sm text-gray-700' : ''}">${opt}</label>
            </div>`).join('');
          break;
        case 'checkbox':
          inputElement = `
            <div class="${isTailwind ? 'flex items-center' : ''}">
              <input type="checkbox" id="${fieldId}" name="${field.id}" required={${field.required}} bind:checked={formData['${field.id}']} class="${isTailwind ? 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded' : ''}">
              <label for="${fieldId}" class="${isTailwind ? 'ml-2 block text-sm text-gray-700' : ''}">${field.label}</label>
            </div>`;
          break;
        default:
          inputElement = `<input type="${field.type}" id="${fieldId}" name="${field.id}" placeholder="${field.placeholder}" required={${field.required}} class="${inputClass}" bind:value={formData['${field.id}']}>`;
      }

      return `
    <div class="${isTailwind ? 'mb-4' : 'form-group'}">
      ${field.type !== 'checkbox' ? `<label for="${fieldId}" class="${labelClass}">${field.label}</label>` : ''}
      ${inputElement}
    </div>`;
    }).join('');

    return `<script>
  let formData = {};

  function handleSubmit() {
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  }
</script>

<div class="${isTailwind ? 'max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200' : 'form-container'}">
  <h1 class="${isTailwind ? 'text-2xl font-bold mb-2' : ''}">${this.title}</h1>
  <p class="${isTailwind ? 'text-gray-600 mb-8' : ''}">${this.description}</p>
  
  <form on:submit|preventDefault={handleSubmit}>
    ${formFields}
    <div class="${isTailwind ? 'mt-6' : ''}">
      <button type="submit" class="${isTailwind ? 'w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium border-none cursor-pointer' : 'btn'}">
        Submit
      </button>
    </div>
  </form>
</div>`;
  }

  private generateAngular(styling: string): string {
    const isTailwind = styling === 'tailwind';
    
    return `// components/${this.title.replace(/\s+/g, '')}.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  formData: any = {};

  onSubmit() {
    console.log('Form submitted:', this.formData);
    alert('Form submitted successfully!');
  }
}

// components/form.component.html
<div class="${isTailwind ? 'max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg' : 'form-container'}">
  <h1>${this.title}</h1>
  <p>${this.description}</p>
  
  <form (ngSubmit)="onSubmit()">
    <!-- Form fields would go here with [(ngModel)] -->
    <button type="submit">Submit</button>
  </form>
</div>`;
  }

  private generatePHP(styling: string): string {
    const html = this.generateHTML(styling);
    return `<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $formData = $_POST;
    // Process form data here
    echo "<script>alert('Form submitted!');</script>";
}
?>
${html}`;
  }
}
