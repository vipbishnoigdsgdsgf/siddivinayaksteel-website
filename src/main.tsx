
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize wallet error prevention early
import './utils/walletUtils'
// Initialize startup testing
import './utils/startupTest'
// Initialize profile operations testing
import './utils/quickTest'
// Initialize schema checking
import './utils/schemaCheck'

// Global error handler to prevent blank screens and suppress wallet errors
window.addEventListener('error', (event) => {
  // Suppress specific wallet errors
  if (event.error?.message?.includes('wallet must has at least one account') ||
      event.error?.code === 4001 ||
      event.filename?.includes('inpage.js')) {
    console.warn('Wallet error suppressed:', event.error);
    event.preventDefault();
    event.stopPropagation();
    return true;
  }
  
  console.error('Global error caught:', event.error);
  
  // Only show error UI if we're getting a blank screen
  if (document.body.children.length === 0 || 
      (document.getElementById('root')?.children.length === 0)) {
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'h-screen w-screen flex items-center justify-center bg-dark-100';
    errorDiv.innerHTML = `
      <div class="max-w-md p-8 bg-dark-200 rounded shadow-lg border border-steel/20">
        <h2 class="text-xl font-bold text-white mb-4">Something went wrong</h2>
        <p class="text-gray-400 mb-6">The application encountered an error. Please try refreshing the page.</p>
        <button onclick="window.location.reload()" 
                class="px-4 py-2 bg-steel text-white rounded hover:bg-steel/80">
          Refresh Page
        </button>
      </div>
    `;
    
    document.body.innerHTML = '';
    document.body.appendChild(errorDiv);
  }
  
  // Let the error propagate so it can be logged (unless suppressed above)
  return false;
});

// Additional error suppression for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  // Suppress specific wallet promise rejections
  if (event.reason?.message?.includes('wallet must has at least one account') ||
      event.reason?.code === 4001) {
    console.warn('Wallet promise rejection suppressed:', event.reason);
    event.preventDefault();
    return;
  }
  
  console.error('Unhandled promise rejection:', event.reason);
});

try {
  createRoot(document.getElementById("root")!).render(<App />);
} catch (error) {
  console.error('Failed to render application:', error);
  
  // Provide a fallback UI when render fails
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div class="h-screen w-screen flex items-center justify-center bg-dark-100">
        <div class="max-w-md p-8 bg-dark-200 rounded shadow-lg border border-steel/20">
          <h2 class="text-xl font-bold text-white mb-4">Application Error</h2>
          <p class="text-gray-400 mb-6">Failed to initialize the application. Please try refreshing the page.</p>
          <button onclick="window.location.reload()" 
                  class="px-4 py-2 bg-steel text-white rounded hover:bg-steel/80">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}
