"use client";

import React, { useState, useEffect } from "react";
import { Wallet, Check, Save, Loader2, Copy } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/store/useAuthStore";
import { useWalletAddresses, useSaveWalletAddress } from "@/hooks/useWallet";
import { CryptoNetwork } from "@/types/wallet";
import { toast } from "sonner";

interface NetworkOption {
  id: string;
  name: string;
  enumKey: CryptoNetwork;
}

const NETWORKS: NetworkOption[] = [
  { id: "trc20", name: "TRC20 (Tron)", enumKey: CryptoNetwork.TRC20 },
  { id: "erc20", name: "ERC20 (Ethereum)", enumKey: CryptoNetwork.ERC20 },
  { id: "btc", name: "BTC (Bitcoin)", enumKey: CryptoNetwork.BTC },
];

export default function WalletPage() {
  const { user } = useAuthStore();
  const { data: profile } = useProfile();

  const { data: walletAddresses = [], isLoading: isLoadingAddresses } = useWalletAddresses();
  const saveWalletMutation = useSaveWalletAddress();

  const rawBalance = profile?.balance ?? user?.balance ?? "0";
  const formattedBalance = `$${Number(rawBalance || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const [selectedNetwork, setSelectedNetwork] = useState<NetworkOption>(NETWORKS[0]);
  const [addressInput, setAddressInput] = useState<string>("");

  // Map backend addresses by network key
  const getSavedAddress = (networkKey: CryptoNetwork): string => {
    const item = walletAddresses.find(
      (a) => a.network?.toString().toUpperCase() === networkKey.toUpperCase()
    );
    return item?.address || "";
  };

  // Sync address input when network selection or fetched addresses change
  useEffect(() => {
    const saved = getSavedAddress(selectedNetwork.enumKey);
    setAddressInput(saved);
  }, [selectedNetwork, walletAddresses]);

  // Handle Select Network
  const handleSelectNetwork = (network: NetworkOption) => {
    setSelectedNetwork(network);
    const saved = getSavedAddress(network.enumKey);
    setAddressInput(saved);
  };

  // Handle Save Address
  const handleSaveAddress = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const cleanAddress = addressInput.trim();
    if (!cleanAddress) {
      toast.error(`Please enter a valid ${selectedNetwork.name} wallet address`);
      return;
    }

    saveWalletMutation.mutate({
      network: selectedNetwork.enumKey,
      address: cleanAddress,
    });
  };

  // Copy address to clipboard
  const handleCopyAddress = (addr: string, netName: string) => {
    if (!addr) return;
    navigator.clipboard.writeText(addr);
    toast.success(`${netName} address copied to clipboard!`);
  };

  const currentSavedAddress = getSavedAddress(selectedNetwork.enumKey);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
          Wallet
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal">
          Manage your wallet addresses for different crypto networks
        </p>
      </div>

      {/* Card 1: Available Balance */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-7 shadow-2xs flex items-center gap-4 sm:gap-5">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100/80 border border-gray-200/80 rounded-2xl flex items-center justify-center shrink-0">
          <Wallet className="w-6 h-6 text-gray-800" />
        </div>
        <div>
          <span className="text-xs sm:text-sm font-medium text-gray-500 block">
            Available Balance
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight mt-0.5">
            {formattedBalance}
          </h2>
        </div>
      </div>

      {/* Card 2: Wallet Addresses Card */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
            Wallet Addresses
          </h2>
          {isLoadingAddresses && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
              <span>Loading addresses...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveAddress} className="space-y-6">
          {/* Network Selection */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2.5 block">
              Select Network
            </label>
            <div className="flex flex-wrap gap-3">
              {NETWORKS.map((net) => {
                const isSelected = selectedNetwork.id === net.id;
                const hasSavedAddress = Boolean(getSavedAddress(net.enumKey));

                return (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => handleSelectNetwork(net)}
                    className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2.5 border transition-all cursor-pointer ${
                      isSelected
                        ? "border-2 border-black bg-gray-100/70 text-gray-900 shadow-2xs font-semibold"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50/50"
                    }`}
                  >
                    {isSelected ? (
                      <div className="w-4 h-4 bg-black text-white rounded-2xs flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 border border-gray-300 rounded-2xs shrink-0" />
                    )}
                    <span>{net.name}</span>
                    {hasSavedAddress && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Address Input Area */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 block">
              {selectedNetwork.name} Address
            </label>
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder={`Enter your ${selectedNetwork.name} address`}
              disabled={saveWalletMutation.isPending}
              className="w-full bg-white border border-gray-300 rounded-2xs px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all disabled:opacity-60 disabled:bg-gray-50"
            />
            {/* Status Text */}
            {currentSavedAddress ? (
              <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1.5">
                <span>✓</span>
                <span>{selectedNetwork.name} address configured and saved</span>
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-2 font-normal">
                No address saved for {selectedNetwork.name} yet.
              </p>
            )}
          </div>

          {/* Save Address Button */}
          <div>
            <button
              type="submit"
              disabled={saveWalletMutation.isPending}
              className="bg-black hover:bg-neutral-800 disabled:bg-neutral-600 text-white font-medium px-5 py-2.5 rounded-md flex items-center gap-2 text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs"
            >
              {saveWalletMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Address</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Your Wallet Addresses List */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 font-sans">
            Your Wallet Addresses
          </h3>
          <div className="space-y-2.5">
            {NETWORKS.map((net) => {
              const savedAddress = getSavedAddress(net.enumKey);
              const isAdded = Boolean(savedAddress);

              return (
                <div
                  key={net.id}
                  className="bg-[#f9fafb] border border-gray-100 rounded-lg px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-2 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium text-gray-800 shrink-0">{net.name}</span>
                    {isAdded && (
                      <span className="font-mono text-xs text-gray-500 truncate max-w-[200px] sm:max-w-[320px]">
                        ({savedAddress})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {isAdded ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCopyAddress(savedAddress, net.name)}
                          className="text-gray-500 hover:text-gray-900 p-1 rounded transition-colors cursor-pointer"
                          title="Copy address"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-emerald-600 font-medium text-xs sm:text-sm flex items-center gap-1">
                          ✓ Saved
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400 font-normal text-xs sm:text-sm">
                        Not Configured
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

