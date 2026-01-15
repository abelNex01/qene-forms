export const generateValidationSchema = (fields: any[], type: 'zod' | 'yup' = 'zod'): string => {
  if (type === 'zod') {
    return generateZodSchema(fields);
  } else {
    return generateYupSchema(fields);
  }
};

const generateZodSchema = (fields: any[]): string => {
  let schema = `import { z } from 'zod';\n\nexport const formSchema = z.object({\n`;
  
  fields.forEach(field => {
    let rule = 'z.string()'; // Default

    switch (field.type) {
        case 'email':
            rule = 'z.string().email()';
            break;
        case 'number':
            rule = 'z.number()';
            break;
        case 'url':
            rule = 'z.string().url()';
            break;
        case 'checkbox':
             rule = 'z.boolean()';
             break;
        // Add more types
    }

    if (field.required) {
        if (field.type === 'string') rule += `.min(1, { message: "${field.label} is required" })`;
    } else {
        rule += `.optional()`;
    }

    // Add sanitization for property names to valid JS identifiers
    const key = field.label ? field.label.toLowerCase().replace(/[^a-z0-9]/g, '_') : field.id;
    schema += `  ${key}: ${rule},\n`;
  });

  schema += `});`;
  return schema;
};

const generateYupSchema = (fields: any[]): string => {
    let schema = `import * as yup from 'yup';\n\nexport const formSchema = yup.object().shape({\n`;
    
    fields.forEach(field => {
      let rule = 'yup.string()'; // Default
  
      switch (field.type) {
          case 'email':
              rule = 'yup.string().email()';
              break;
          case 'number':
              rule = 'yup.number()';
              break;
          case 'url':
              rule = 'yup.string().url()';
              break;
           case 'checkbox':
               rule = 'yup.boolean()';
               break;
      }
  
      if (field.required) {
          rule += `.required("${field.label || 'Field'} is required")`;
      }
  
      const key = field.label ? field.label.toLowerCase().replace(/[^a-z0-9]/g, '_') : field.id;
      schema += `  ${key}: ${rule},\n`;
    });
  
    schema += `});`;
    return schema;
};
