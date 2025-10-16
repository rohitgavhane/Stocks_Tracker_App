
"use client"

/**
 * Watchlist management utilities
 * Stores watchlist data in memory during the session
 */

export interface WatchlistStock {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
  addedAt: string;
}

// In-memory storage for watchlist
let watchlistStore: Map<string, WatchlistStock> = new Map();

/**
 * Add a stock to the watchlist
 */
export function addToWatchlist(stock: {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}): void {
  const watchlistStock: WatchlistStock = {
    ...stock,
    addedAt: new Date().toISOString(),
  };
  
  watchlistStore.set(stock.symbol, watchlistStock);
  
  // Trigger a custom event to notify other components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('watchlistUpdated'));
  }
}

/**
 * Remove a stock from the watchlist
 */
export function removeFromWatchlist(symbol: string): boolean {
  const deleted = watchlistStore.delete(symbol);
  
  // Trigger a custom event to notify other components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('watchlistUpdated'));
  }
  
  return deleted;
}

/**
 * Check if a stock is in the watchlist
 */
export function isInWatchlist(symbol: string): boolean {
  return watchlistStore.has(symbol);
}

/**
 * Get all stocks in the watchlist
 */
export function getWatchlist(): WatchlistStock[] {
  return Array.from(watchlistStore.values()).sort((a, b) => {
    return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
  });
}

/**
 * Get a specific stock from the watchlist
 */
export function getWatchlistStock(symbol: string): WatchlistStock | undefined {
  return watchlistStore.get(symbol);
}

/**
 * Clear the entire watchlist
 */
export function clearWatchlist(): void {
  watchlistStore.clear();
  
  // Trigger a custom event to notify other components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('watchlistUpdated'));
  }
}

/**
 * Get the count of stocks in the watchlist
 */
export function getWatchlistCount(): number {
  return watchlistStore.size;
}

/**
 * Toggle a stock in the watchlist (add if not present, remove if present)
 */
export function toggleWatchlist(stock: {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}): boolean {
  if (isInWatchlist(stock.symbol)) {
    removeFromWatchlist(stock.symbol);
    return false;
  } else {
    addToWatchlist(stock);
    return true;
  }
}

/**
 * Export watchlist data as JSON
 */
export function exportWatchlist(): string {
  return JSON.stringify(getWatchlist(), null, 2);
}

/**
 * Import watchlist data from JSON
 */
export function importWatchlist(jsonData: string): void {
  try {
    const stocks: WatchlistStock[] = JSON.parse(jsonData);
    stocks.forEach(stock => {
      watchlistStore.set(stock.symbol, stock);
    });
    
    // Trigger a custom event to notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('watchlistUpdated'));
    }
  } catch (error) {
    console.error('Failed to import watchlist:', error);
    throw new Error('Invalid watchlist data');
  }
}