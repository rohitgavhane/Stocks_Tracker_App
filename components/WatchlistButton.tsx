"use client";
import React, { useMemo, useState, useEffect } from "react";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/Watchlist";

interface WatchlistButtonProps {
  symbol: string;
  company: string;
  exchange?: string;
  type?: "button" | "icon";
  stockType?: string;
  isInWatchlist?: boolean;
  showTrashIcon?: boolean;
  onWatchlistChange?: (symbol: string, added: boolean) => void;
}

const WatchlistButton = ({
  symbol,
  company,
  exchange = "NASDAQ",
  type = "button",
  stockType = "Common Stock",
  isInWatchlist: initialIsInWatchlist,
  showTrashIcon = false,
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(!!initialIsInWatchlist);

  // Check if stock is already in watchlist on mount
  useEffect(() => {
    setAdded(isInWatchlist(symbol));
  }, [symbol]);

  // Listen for watchlist updates from other components
  useEffect(() => {
    const handleWatchlistUpdate = () => {
      setAdded(isInWatchlist(symbol));
    };

    window.addEventListener("watchlistUpdated", handleWatchlistUpdate);

    return () => {
      window.removeEventListener("watchlistUpdated", handleWatchlistUpdate);
    };
  }, [symbol]);

  const label = useMemo(() => {
    if (type === "icon") return added ? "" : "";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  const handleClick = () => {
    const next = !added;
    
    if (next) {
      // Add to watchlist
      addToWatchlist({
        symbol,
        name: company,
        exchange,
        type: stockType,
      });
    } else {
      // Remove from watchlist
      removeFromWatchlist(symbol);
    }
    
    setAdded(next);
    onWatchlistChange?.(symbol, next);
  };

  if (type === "icon") {
    return (
      <button
        title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={added ? "#FACC15" : "none"}
          stroke="#FACC15"
          strokeWidth="1.5"
          className="watchlist-star"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button className={`watchlist-btn ${added ? "watchlist-remove" : ""}`} onClick={handleClick}>
      {showTrashIcon && added ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6" />
        </svg>
      ) : null}
      <span>{label}</span>
    </button>
  );
};

export default WatchlistButton;


// ============================================
// USAGE EXAMPLE
// ============================================

/*
// In your stock detail page or anywhere you want to use it:

import WatchlistButton from "@/components/WatchlistButton";

// Example 1: Button type (default)
<WatchlistButton 
  symbol="AAPL"
  company="Apple Inc."
  exchange="NASDAQ"
  stockType="Common Stock"
/>

// Example 2: Icon type (star icon only)
<WatchlistButton 
  symbol="AAPL"
  company="Apple Inc."
  exchange="NASDAQ"
  type="icon"
/>

// Example 3: With trash icon when added
<WatchlistButton 
  symbol="AAPL"
  company="Apple Inc."
  exchange="NASDAQ"
  showTrashIcon={true}
/>

// Example 4: With callback
<WatchlistButton 
  symbol="AAPL"
  company="Apple Inc."
  exchange="NASDAQ"
  onWatchlistChange={(symbol, added) => {
    console.log(`${symbol} ${added ? 'added to' : 'removed from'} watchlist`);
  }}
/>
*/