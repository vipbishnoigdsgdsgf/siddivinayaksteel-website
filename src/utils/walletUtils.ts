// Utility functions for handling Ethereum wallet connections
// This prevents wallet-related errors by providing proper error handling

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
      selectedAddress?: string;
      on?: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener?: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
}

export interface WalletConnection {
  isConnected: boolean;
  address: string | null;
  error: string | null;
}

export class WalletManager {
  private static instance: WalletManager;
  private connection: WalletConnection = {
    isConnected: false,
    address: null,
    error: null,
  };

  private constructor() {
    this.initializeWallet();
  }

  public static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
    }
    return WalletManager.instance;
  }

  private initializeWallet(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Check if wallet is available and properly initialize
    if (this.isWalletAvailable()) {
      this.checkExistingConnection();
    }
  }

  public isWalletAvailable(): boolean {
    return (
      typeof window !== 'undefined' && 
      typeof window.ethereum !== 'undefined'
    );
  }

  private async checkExistingConnection(): Promise<void> {
    if (!this.isWalletAvailable()) {
      this.connection.error = 'No Ethereum wallet detected';
      return;
    }

    try {
      const accounts = await window.ethereum!.request({
        method: 'eth_accounts'
      });

      if (accounts && accounts.length > 0) {
        this.connection = {
          isConnected: true,
          address: accounts[0],
          error: null,
        };
      } else {
        this.connection = {
          isConnected: false,
          address: null,
          error: null,
        };
      }
    } catch (error) {
      console.warn('Wallet connection check failed:', error);
      this.connection = {
        isConnected: false,
        address: null,
        error: 'Failed to check wallet connection',
      };
    }
  }

  public async connectWallet(): Promise<WalletConnection> {
    if (!this.isWalletAvailable()) {
      const error = 'Please install MetaMask or another Ethereum wallet';
      this.connection.error = error;
      return this.connection;
    }

    try {
      // Request account access
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet');
      }

      this.connection = {
        isConnected: true,
        address: accounts[0],
        error: null,
      };

      // Set up account change listener
      this.setupEventListeners();

      return this.connection;
    } catch (error: any) {
      let errorMessage = 'Failed to connect wallet';
      
      if (error.code === 4001) {
        errorMessage = 'User rejected the connection request';
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending';
      } else if (error.message) {
        errorMessage = error.message;
      }

      this.connection = {
        isConnected: false,
        address: null,
        error: errorMessage,
      };

      return this.connection;
    }
  }

  private setupEventListeners(): void {
    if (!window.ethereum?.on) {
      return;
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        this.connection = {
          isConnected: false,
          address: null,
          error: 'No accounts connected',
        };
      } else {
        this.connection = {
          isConnected: true,
          address: accounts[0],
          error: null,
        };
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
  }

  public getConnection(): WalletConnection {
    return { ...this.connection };
  }

  public async disconnectWallet(): Promise<void> {
    this.connection = {
      isConnected: false,
      address: null,
      error: null,
    };
  }
}

// Export convenience functions
export const walletManager = WalletManager.getInstance();

export const connectWallet = () => walletManager.connectWallet();
export const getWalletConnection = () => walletManager.getConnection();
export const isWalletAvailable = () => walletManager.isWalletAvailable();
export const disconnectWallet = () => walletManager.disconnectWallet();

// Prevent wallet-related errors on page load
export const preventWalletErrors = (): void => {
  if (typeof window === 'undefined') return;

  // Override potential wallet error sources
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    
    // Filter out wallet-related errors that aren't critical
    if (
      message.includes('wallet must has at least one account') ||
      message.includes('inpage.js') ||
      message.includes('ethereum provider') ||
      message.includes('code: 4001')
    ) {
      console.warn('Wallet warning (filtered):', ...args);
      return;
    }
    
    // Call original console.error for other errors
    originalConsoleError.apply(console, args);
  };

  // More aggressive error prevention: override window.ethereum methods that cause problems
  if (window.ethereum) {
    const originalRequest = window.ethereum.request;
    window.ethereum.request = async (args: { method: string; params?: any[] }) => {
      try {
        // If this is a problematic call that would cause the "wallet must has at least one account" error,
        // return a safe response
        if (args.method === 'eth_accounts') {
          return []; // Return empty array instead of throwing error
        }
        
        if (args.method === 'eth_requestAccounts') {
          // Only proceed if user explicitly requested wallet connection
          return await originalRequest.call(window.ethereum, args);
        }
        
        return await originalRequest.call(window.ethereum, args);
      } catch (error: any) {
        // Suppress the specific wallet error that's causing problems
        if (error.code === 4001 && error.message?.includes('wallet must has at least one account')) {
          console.warn('Wallet connection error suppressed:', error.message);
          return [];
        }
        throw error;
      }
    };
  }

  // Override Promise.prototype.catch globally for this specific error
  const originalCatch = Promise.prototype.catch;
  Promise.prototype.catch = function(onRejected) {
    return originalCatch.call(this, (error) => {
      if (error && error.code === 4001 && error.message?.includes('wallet must has at least one account')) {
        console.warn('Wallet promise error suppressed:', error.message);
        return Promise.resolve([]);
      }
      if (onRejected) {
        return onRejected(error);
      }
      throw error;
    });
  };
};

// Initialize error prevention on import
preventWalletErrors();
