"use client"
import React, { useState } from 'react';

const MainForm = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("in the handleSubmit function")
    setIsLoading(true);
    setError(''); // Clear previous errors
    try {
      if (!prompt.trim()) {
        throw new Error('Prompt cannot be empty');
      }
console.log("before fetch", prompt)
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("data", data)
      if (!data.generatedPrompt) {
        throw new Error('No prompt generated');
      }

      setGeneratedPrompt(data.generatedPrompt);
    } catch (error) {
      console.error('Failed to generate prompt:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Prompt Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a topic"
          className="w-full p-2 mb-4 border rounded"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Prompt'}
        </button>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      )}
      {generatedPrompt && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Generated Prompt:</h2>
          <p>{generatedPrompt}</p>
        </div>
      )}
    </div>
  );
};

export default MainForm;
