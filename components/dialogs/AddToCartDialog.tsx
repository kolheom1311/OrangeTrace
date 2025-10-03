"use client";

import { useState } from 'react';
import { Minus, Plus } from 'lucide-react'; // Using icons for a cleaner UI
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// --- Start of Changes ---

type Props = {
  onConfirm: (quantity: number) => void;
  trigger: React.ReactNode;
  availableQuantity: number; // Prop to pass available stock
};

export function AddToCartDialog({ onConfirm, trigger, availableQuantity }: Props) {
// --- End of Changes ---

  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleConfirm = () => {
    onConfirm(quantity);
    setOpen(false);
  };

  // --- Start of Changes ---
  // Function to increase quantity, respecting available stock
  const handleIncrement = () => {
    setQuantity((prev) => (prev < availableQuantity ? prev + 1 : availableQuantity));
  };
  // --- End of Changes ---

  // Function to decrease quantity, ensuring it doesn't go below 1
  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // --- Start of Changes ---
  // Handles direct input changes, preventing invalid values and exceeding stock
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (value > availableQuantity) {
      setQuantity(availableQuantity);
    } else {
      setQuantity(value);
    }
  };
  // --- End of Changes ---


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Quantity</DialogTitle>
          {/* --- Start of Changes: Display available quantity --- */}
          <DialogDescription>
            Enter the amount (in kg) you want to add to your cart.
            <span className="mt-1 block text-sm text-muted-foreground">
              Available: {availableQuantity} kg
            </span>
          </DialogDescription>
          {/* --- End of Changes --- */}
        </DialogHeader>
        
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={handleDecrement}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease quantity</span>
          </Button>

          <Input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            className="w-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            min="1"
            max={availableQuantity} // Set max attribute for semantics
          />

          {/* --- Start of Changes: Disable button when max is reached --- */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full"
            onClick={handleIncrement}
            disabled={quantity >= availableQuantity}
          >
          {/* --- End of Changes --- */}
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => { setOpen(false); setQuantity(1); }}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
