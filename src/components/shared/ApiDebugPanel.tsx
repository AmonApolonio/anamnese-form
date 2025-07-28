import React, { useState } from 'react';
import { ApiDebugger } from '../../services';

/**
 * Debugging component for testing API services
 * Add this component temporarily to debug API issues
 */
export const ApiDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testUrl, setTestUrl] = useState('https://tantto-assinaturas.s3.us-east-1.amazonaws.com/gennie-mock/vestido1.jpg');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string>('');

  const runTest = async (testFunction: () => Promise<void>, testName: string) => {
    setIsLoading(true);
    setResults(prev => prev + `\n🔍 Starting ${testName}...\n`);
    
    // Capture console logs
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      setResults(prev => prev + args.join(' ') + '\n');
      originalLog(...args);
    };
    
    console.error = (...args) => {
      setResults(prev => prev + '❌ ' + args.join(' ') + '\n');
      originalError(...args);
    };
    
    try {
      await testFunction();
      setResults(prev => prev + `✅ ${testName} completed\n\n`);
    } catch (error: any) {
      setResults(prev => prev + `❌ ${testName} failed: ${error.message}\n\n`);
    } finally {
      console.log = originalLog;
      console.error = originalError;
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: '#947B62',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          🔧 API Debug
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: '400px',
      maxHeight: '80vh',
      background: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontSize: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', color: '#947B62' }}>🔧 API Debugger</h3>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            color: '#999'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          Test Image URL:
        </label>
        <input
          type="text"
          value={testUrl}
          onChange={(e) => setTestUrl(e.target.value)}
          style={{
            width: '100%',
            padding: '4px 8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '11px'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        <button
          onClick={() => runTest(async () => { ApiDebugger.testConfiguration(); }, 'Configuration Test')}
          disabled={isLoading}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '6px 8px',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '11px'
          }}
        >
          Test Config
        </button>

        <button
          onClick={() => runTest(() => ApiDebugger.testColorAnalysis(testUrl), 'Color Analysis')}
          disabled={isLoading}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '6px 8px',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '11px'
          }}
        >
          Test Color
        </button>

        <button
          onClick={() => runTest(() => ApiDebugger.testBackgroundRemoval(testUrl), 'Background Removal')}
          disabled={isLoading}
          style={{
            background: '#FF9800',
            color: 'white',
            border: 'none',
            padding: '6px 8px',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '11px'
          }}
        >
          Test BG Remove
        </button>

        <button
          onClick={() => setResults('')}
          disabled={isLoading}
          style={{
            background: '#f44336',
            color: 'white',
            border: 'none',
            padding: '6px 8px',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '11px'
          }}
        >
          Clear Results
        </button>
      </div>

      <div style={{
        background: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '8px',
        maxHeight: '300px',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '10px',
        whiteSpace: 'pre-wrap'
      }}>
        {results || 'No tests run yet. Click a button above to start testing.'}
        {isLoading && <div style={{ color: '#2196F3' }}>⏳ Running test...</div>}
      </div>

      <div style={{ marginTop: '8px', fontSize: '10px', color: '#666' }}>
        💡 Tip: Check browser console for detailed logs
      </div>
    </div>
  );
};

export default ApiDebugPanel;
