import React from 'react';
import AIEditor from '../components/ai-editor';
import { AIProvider } from '../ai/context';

export default function Dashboard() {
  return (
    <AIProvider>
      <AIEditor />
    </AIProvider>
  );
}
