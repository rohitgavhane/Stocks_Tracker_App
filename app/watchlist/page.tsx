"use client"

import { useEffect, useState } from "react";
import { Star, TrendingUp, Trash2, Download, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  getWatchlist,
  removeFromWatchlist,
  clearWatchlist,
  exportWatchlist,
  importWatchlist,
  type WatchlistStock,
} from "@/lib/Watchlist";
import Image from "next/image";
import NavItems from "@/components/NavItems";

export default function WatchlistPage({ children }: { children : React.ReactNode }) {
  
  const [watchlist, setWatchlist] = useState<WatchlistStock[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWatchlist = () => {
    const stocks = getWatchlist();
    setWatchlist(stocks);
    setLoading(false);
  };

  useEffect(() => {
    loadWatchlist();

    const handleWatchlistUpdate = () => {
      loadWatchlist();
    };

    window.addEventListener("watchlistUpdated", handleWatchlistUpdate);
    return () => {
      window.removeEventListener("watchlistUpdated", handleWatchlistUpdate);
    };
  }, []);

  const handleRemove = (symbol: string) => {
    removeFromWatchlist(symbol);
    loadWatchlist();
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear your entire watchlist?")) {
      clearWatchlist();
      loadWatchlist();
    }
  };

  const handleExport = () => {
    const data = exportWatchlist();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `watchlist-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = event.target?.result as string;
            importWatchlist(data);
            loadWatchlist();
            alert("Watchlist imported successfully!");
          } catch (error) {
            alert("Failed to import watchlist. Please check the file format.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-300 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading watchlist...</div>
          </div>
        </div>
      </div>
    );
  }

  return (



        <div className="z-10 relative lg:mt-4 lg:mb-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                My Watchlist
              </h1>
              <p className="text-gray-400">
                Track your favorite stocks ({watchlist.length} stocks)
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleImport}
                variant="outline"
                className="gap-2 bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
              >
                <Upload className="h-4 w-4" />
                Import
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                className="gap-2 bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
                disabled={watchlist.length === 0}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                onClick={handleClearAll}
                variant="destructive"
                className="gap-2 bg-red-600 hover:bg-red-700 text-white"
                disabled={watchlist.length === 0}
              >
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            </div>
            </div>
          </div>
        </div>

        {/* Watchlist Grid */}
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-900 rounded-xl border border-gray-800">
            <Star className="h-16 w-16 text-gray-600 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              Your watchlist is empty
            </h2>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              Search for stocks and click the star icon to add them to your
              watchlist
            </p>
            <Button asChild className="bg-yellow-500 hover:bg-yellow-400 text-black">
              <Link href="/">Browse Stocks</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((stock) => (
              <div
                key={stock.symbol}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:shadow-lg hover:border-yellow-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link href={`/stocks/${stock.symbol}`} className="group">
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors">
                        {stock.symbol}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {stock.name}
                      </p>
                    </Link>
                  </div>
                  <button
                    onClick={() => handleRemove(stock.symbol)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    title="Remove from watchlist"
                  >
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{stock.exchange}</span>
                  </div>
                  <span>•</span>
                  <span>{stock.type}</span>
                </div>

                <div className="text-xs text-gray-600">
                  Added {new Date(stock.addedAt).toLocaleDateString()}
                </div>

                <Link href={`/stocks/${stock.symbol}`} className="mt-4 block w-full">
                  <Button
                    variant="outline"
                    className="w-full bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
     );
}
