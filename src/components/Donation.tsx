import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Copy, Check, Terminal, Minus, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import telebirrLogo from '@/assets/telebirr.svg';
import cbeLogo from '@/assets/cbe.svg';
import { cn } from '@/lib/utils';

interface DonationProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Bank {
  id: string;
  name: string;
  logo: string;
  account: string;
  color: string;
  borderColor: string;
  accent: string;
}

export default function Donation({ isOpen, onClose }: DonationProps) {
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setAmount('');
        setSelectedBank(null);
        setIsSuccess(false);
        setShowConfirmation(false);
      }, 500);
    }
  }, [isOpen]);

  const banks: Bank[] = [
    {
      id: 'cbe',
      name: 'Commercial Bank of Ethiopia',
      logo: cbeLogo,
      account: '1000521265527',
      color: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      accent: 'text-purple-500'
    },
    {
      id: 'telebirr',
      name: 'Telebirr',
      logo: telebirrLogo,
      account: '0978004968',
      color: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      accent: 'text-blue-500'
    }
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDonateComplete = () => {
    setIsSuccess(true);
  };

  const t = {
    'donation.title': 'SUPPORT_THE_PROJECT',
    'donation.desc': 'Design visually, customize with code, and help us keep the project alive.',
    'donation.amountLabel': 'DONATION_AMOUNT_ETB',
    'donation.bankLabel': 'SELECT_PAYMENT_METHOD',
    'donation.accountLabel': 'ACCOUNT_NUMBER',
    'donation.btn': 'INITIATE_TRANSFER',
    'donation.confirmBtn': 'I_HAVE_TRANSFERRED_THE_AMOUNT',
    'donation.thanks': 'DONATION_SUCCESSFUL',
    'donation.thanksDesc': 'Your donation of {amount} ETB has been received. Thank you for supporting open source innovation.',
    'donation.back': 'RETURN_TO_SYSTEM'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Terminal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-lg bg-card border border-border neo-border shadow-2xl flex flex-col font-mono"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30 select-none">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div onClick={onClose} className="w-2.5 h-2.5 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-500 transition-colors" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground ml-2">
                  <Terminal className="w-3 h-3" />
                  <span className="opacity-50">user@qene:~/</span>
                  <span className="text-foreground font-bold">support_project.sh</span>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-1 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Terminal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto scan-lines bg-black/40">
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    {/* Intro Section */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-primary fill-primary animate-pulse" />
                        <h2 className="text-lg font-bold text-primary tracking-tight">
                          {t['donation.title']}
                        </h2>
                      </div>
                      <div className="p-3 bg-muted/20 border-l border-primary text-xs text-muted-foreground leading-relaxed">
                        <span className="text-primary mr-2">{'>'}</span>{t['donation.desc']}
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Amount Input */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                          <span className="text-primary">01.</span> {t['donation.amountLabel']}
                        </label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary text-sm font-bold border-r border-border pr-3">ETB</div>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-16 pr-4 py-3 bg-black/50 border border-border focus:border-primary outline-none transition-all text-sm font-bold placeholder:opacity-30"
                          />
                        </div>
                      </div>

                      {/* Bank Selection */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                          <span className="text-primary">02.</span> {t['donation.bankLabel']}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {banks.map((bank) => (
                            <button
                              key={bank.id}
                              onClick={() => {
                                setSelectedBank(bank);
                                setShowConfirmation(false);
                              }}
                              className={cn(
                                "relative p-3 border transition-all flex flex-col items-center gap-2",
                                selectedBank?.id === bank.id 
                                  ? 'border-primary bg-primary/5 shadow-[0_0_15px_rgba(194,232,18,0.1)]' 
                                  : 'border-border hover:border-primary/50'
                              )}
                            >
                              <div className="h-8 w-full flex items-center justify-center opacity-70 group-hover:opacity-100 grayscale hover:grayscale-0 transition-all">
                                <img src={bank.logo} alt={bank.name} className="max-h-full max-w-full object-contain" />
                              </div>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest text-center">
                                {bank.id}
                              </span>
                              {selectedBank?.id === bank.id && (
                                <div className="absolute top-1 right-1">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Display Account Details */}
                      <AnimatePresence mode="wait">
                        {selectedBank && (
                          <motion.div
                            key={selectedBank.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                          >
                            <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-2">
                              <span className="text-primary">03.</span> {t['donation.accountLabel']}
                            </label>
                            <div className={cn(
                              "p-4 border relative group overflow-hidden bg-black/40",
                              selectedBank.id === 'cbe' ? 'border-purple-500/30' : 'border-blue-500/30'
                            )}>
                              <div className="flex items-center justify-between relative z-10">
                                <div className="space-y-1">
                                  <p className="text-[9px] font-bold text-muted-foreground opacity-50 uppercase tracking-widest leading-none">
                                    {selectedBank.name}
                                  </p>
                                  <p className={cn(
                                    "text-lg font-bold tracking-tight leading-none",
                                    selectedBank.id === 'cbe' ? 'text-purple-400' : 'text-blue-400'
                                  )}>
                                    {selectedBank.account}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleCopy(selectedBank.account)}
                                  className="p-2 border border-border hover:border-primary hover:text-primary transition-all bg-card"
                                >
                                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {!showConfirmation ? (
                              <Button
                                onClick={() => setShowConfirmation(true)}
                                disabled={!amount}
                                className="w-full h-12 bg-primary text-background hover:bg-primary/90 font-bold tracking-widest text-xs btn-shadow-primary"
                              >
                                {t['donation.btn']}
                              </Button>
                            ) : (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.98 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="space-y-3 pt-2"
                                >
                                    <div className="p-3 bg-primary/5 border border-primary/30 flex items-start gap-4">
                                        <div className="p-1 bg-primary text-background mt-0.5">
                                            <Terminal className="w-3 h-3" />
                                        </div>
                                        <p className="text-[10px] text-primary/80 leading-relaxed font-bold">
                                            PLEASE TRANSFER THE SPECIFIED AMOUNT TO THE ACCOUNT ABOVE AND CLICK THE BUTTON BELOW TO FINALIZE.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleDonateComplete}
                                        className="w-full h-12 bg-primary text-background hover:bg-primary/90 font-bold tracking-widest text-xs"
                                    >
                                        {t['donation.confirmBtn']}
                                    </Button>
                                </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-8 space-y-6"
                  >
                    <div className="w-20 h-20 bg-primary/10 border-2 border-primary/20 flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                      <Check className="w-10 h-10 text-primary relative z-10 stroke-[3px]" />
                    </div>
                    
                    <div className="space-y-3">
                      <h2 className="text-xl font-bold text-primary tracking-tighter">
                        {t['donation.thanks']}
                      </h2>
                      <div className="p-4 bg-muted/10 border border-border text-xs text-muted-foreground leading-relaxed max-w-sm">
                        <span className="text-primary mr-2">{'>'}</span>
                        {t['donation.thanksDesc'].replace('{amount}', amount)}
                      </div>
                    </div>
                    
                    <div className="w-full pt-4">
                      <Button
                        onClick={onClose}
                        variant="outline"
                        className="w-full h-12 border-primary/30 text-primary hover:bg-primary/5 tracking-widest text-xs font-bold"
                      >
                        {t['donation.back']}
                      </Button>
                    </div>

                    <div className="text-[10px] text-muted-foreground/30 flex items-center gap-2 pt-4">
                        <Square className="w-2 h-2 fill-current" />
                        <span>SESSION_ENDED // NO_FURTHER_ACTION_REQUIRED</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Terminal Footer */}
            <div className="px-6 py-3 border-t border-border bg-muted/20 flex justify-between items-center bg-black/40">
                <div className="flex gap-4">
                    <div className="text-[9px] text-muted-foreground flex gap-2">
                        <span className="opacity-50 uppercase">enc:</span>
                        <span className="text-foreground">UTF-8</span>
                    </div>
                    <div className="text-[9px] text-muted-foreground flex gap-2">
                        <span className="opacity-50 uppercase">ln:</span>
                        <span className="text-foreground">64,12</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    SYSTEM_READY
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
