"use client";

import React, { useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuthStore } from "@/store/useAuthStore";
import { useWalletAddresses, useCreateWithdrawal } from "@/hooks/useWallet";
import { CryptoNetwork } from "@/types/wallet";
import { toast } from "sonner";
import { WithdrawModal } from "@/components/ui/WithdrawModal";

interface NetworkOption {
  id: string;
  name: string;
  key: string;
  enumKey: CryptoNetwork;
}

const NETWORKS: NetworkOption[] = [
  { id: "trc20", name: "TRC20 (Tron)", key: "TRC20 Wallet", enumKey: CryptoNetwork.TRC20 },
  { id: "erc20", name: "ERC20 (Ethereum)", key: "ERC20 Wallet", enumKey: CryptoNetwork.ERC20 },
  { id: "btc", name: "BTC (Bitcoin)", key: "BTC Wallet", enumKey: CryptoNetwork.BTC },
];

const PRESETS = [
  { label: "$100", value: "100" },
  { label: "$150", value: "150" },
  { label: "$200", value: "200" },
  { label: "$1,000", value: "1000" },
  { label: "$1,500", value: "1500" },
  { label: "$2,000", value: "2000" },
];

export default function WithdrawPage() {
  const { user } = useAuthStore();
  const { data: profile } = useProfile();
  const { data: walletAddresses = [] } = useWalletAddresses();

  const rawBalance = profile?.balance ?? user?.balance ?? "0";
  const formattedBalance = `$${Number(rawBalance || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const [amount, setAmount] = useState<string>("");
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkOption>(NETWORKS[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    mutate: createWithdrawal,
    isPending,
    error: withdrawalError,
  } = useCreateWithdrawal({
    onSuccessCallback: () => {
      setIsModalOpen(false);
      setAmount("");
    },
  });

  const currentAddressItem = walletAddresses.find(
    (a) => a.network?.toString().toUpperCase() === selectedNetwork.enumKey.toUpperCase()
  );
  const currentAddress = currentAddressItem?.address || "";

  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }

    const currentBal = parseFloat(String(rawBalance || 0));
    if (numericAmount > currentBal && currentBal > 0) {
      toast.error("Withdrawal amount exceeds available balance");
      return;
    }

    if (!currentAddress || currentAddress.trim() === "") {
      toast.error(`Please configure your ${selectedNetwork.name} wallet address first`);
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirmWithdrawal = (withdrawalPassword: string) => {
    const numericAmount = parseFloat(amount);
    createWithdrawal({
      amount: numericAmount,
      network: selectedNetwork.enumKey,
      withdrawalPassword,
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
          Withdraw
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal">
          Request a withdrawal to your wallet
        </p>
      </div>

      {/* Card 1: Available Balance Banner */}
      <div className="bg-[#111111] text-white p-6 sm:p-8 rounded-none shadow-2xs">
        <span className="text-xs sm:text-sm text-gray-400 font-medium block">
          Available Balance
        </span>
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight mt-1">
          {formattedBalance}
        </h2>
      </div>

      {/* Card 2: Withdraw Form Box */}
      <div className="bg-white border border-gray-200/90 p-6 sm:p-8 rounded-none space-y-6 shadow-2xs">
        <form onSubmit={handleOpenModal} className="space-y-6">
          {/* Withdraw Amount Section */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-800 block mb-2 font-sans">
              Withdraw Amount
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm font-normal">
                $
              </span>
              <input
                type="number"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-white border border-gray-200 rounded-2xs pl-8 pr-4 py-2.5 text-xs sm:text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>

            {/* Quick Select Presets */}
            <div className="flex flex-wrap gap-2.5 mt-4">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setAmount(preset.value)}
                  className={`px-4 py-2 rounded-2xs text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
                    amount === preset.value
                      ? "border-black bg-gray-100 text-gray-900 font-semibold"
                      : "border-gray-200/90 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50/80"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Withdrawal Network Section */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-800 block mb-2.5 font-sans">
              Withdrawal Network
            </label>
            <div className="flex flex-wrap gap-3">
              {NETWORKS.map((net) => {
                const isSelected = selectedNetwork.id === net.id;
                return (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => setSelectedNetwork(net)}
                    className={`px-4 py-3 rounded-2xs text-xs sm:text-sm flex items-center gap-2.5 border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-black border-black text-white font-semibold shadow-2xs"
                        : "bg-white border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50/50 font-medium"
                    }`}
                  >
                    {isSelected ? (
                      <div className="w-4 h-4 bg-white rounded-2xs shrink-0 flex items-center justify-center" />
                    ) : (
                      <div className="w-4 h-4 border border-gray-300 rounded-2xs shrink-0" />
                    )}
                    <span>{net.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Withdrawal Details Box */}
          <div className="bg-[#f3f4f6] p-4 sm:p-5 rounded-2xs space-y-1">
            <span className="text-xs text-gray-400 font-medium block">
              Withdrawal Details
            </span>
            <p className="text-xs sm:text-sm font-bold text-gray-900 font-sans">
              {selectedNetwork.key}
            </p>
            <p className="text-xs text-gray-500 font-normal break-all">
              {currentAddress || "No wallet address configured"}
            </p>
          </div>

          {/* Submit Withdraw Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-800 text-white font-medium py-3 rounded-2xs flex items-center justify-center gap-2 text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Withdraw</span>
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation & Password Modal */}
      <WithdrawModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmWithdrawal}
        isPending={isPending}
        amount={parseFloat(amount) || 0}
        networkName={selectedNetwork.name}
        networkKey={selectedNetwork.key}
        walletAddress={currentAddress}
        error={withdrawalError}
      />
    </div>
  );
}
