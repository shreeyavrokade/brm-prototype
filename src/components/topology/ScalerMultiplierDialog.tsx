import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onApply: (pct: number) => void;
}

const ScalerMultiplierDialog = ({ open, onOpenChange, onApply }: Props) => {
  const [pct, setPct] = useState<string>("100");

  const apply = () => {
    const n = Number(pct);
    if (!Number.isFinite(n) || n <= 0) return;
    onApply(n);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Apply Scaler Multiplier</DialogTitle>
          <DialogDescription>
            Scale the active profile array up or down by a percentage. 100 = no change.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
          <Label htmlFor="pct">Scaler (%)</Label>
          <Input
            id="pct"
            type="number"
            step="1"
            value={pct}
            onChange={(e) => setPct(e.target.value)}
            className="tabular-nums"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={apply} className="bg-brand-secondary text-brand-secondary-invert hover:bg-brand-secondary/90">
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScalerMultiplierDialog;
