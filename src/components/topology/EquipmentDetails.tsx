import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BusGrid, GeneratorGrid } from "./EquipmentGrid";
import {
  initialBusRows, initialGeneratorRows,
  type BusRow, type GeneratorRow,
} from "./equipmentSchemas";

type View = "bus" | "generator";

const EquipmentDetails = () => {
  const [view, setView] = useState<View>("bus");
  const [busRows, setBusRows] = useState<BusRow[]>(initialBusRows);
  const [genRows, setGenRows] = useState<GeneratorRow[]>(initialGeneratorRows);

  const totalRows = busRows.length + genRows.length;

  const updateBus = (i: number, patch: Partial<BusRow>) =>
    setBusRows((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const updateGen = (i: number, patch: Partial<GeneratorRow>) =>
    setGenRows((rows) => rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  // EMPTY STATE
  if (totalRows === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-atmo-0 border border-atmo-4 rounded-md py-16 px-8 text-center">
        <div className="h-12 w-12 rounded-full bg-[#D7E6CF] flex items-center justify-center mb-4">
          <CheckCircle2 className="h-6 w-6 text-[#1F4D1F]" />
        </div>
        <h3 className="text-base font-semibold text-foreground">All infrastructure elements aligned.</h3>
        <p className="mt-1 text-sm text-atmo-9 max-w-md">
          No ancillary equipment details required for this model pass.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && setView(v as View)}
          className="inline-flex gap-0 rounded-md border border-atmo-4 bg-atmo-1 p-0.5"
        >
          <ToggleGroupItem value="bus" className="h-8 px-4 text-sm rounded-sm data-[state=on]:bg-atmo-0 data-[state=on]:text-foreground data-[state=on]:shadow-sm text-atmo-9">
            Bus Details
            <span className="ml-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-atmo-3 px-1 text-[10px] font-semibold text-atmo-10">
              {busRows.length}
            </span>
          </ToggleGroupItem>
          <ToggleGroupItem value="generator" className="h-8 px-4 text-sm rounded-sm data-[state=on]:bg-atmo-0 data-[state=on]:text-foreground data-[state=on]:shadow-sm text-atmo-9">
            Generator Details
            <span className="ml-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-atmo-3 px-1 text-[10px] font-semibold text-atmo-10">
              {genRows.length}
            </span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="relative bg-atmo-0 border border-atmo-4 rounded-md overflow-hidden">
        {view === "bus"
          ? <BusGrid rows={busRows} onChange={updateBus} locked={false} />
          : <GeneratorGrid rows={genRows} onChange={updateGen} locked={false} />}
      </div>
    </div>
  );
};

export default EquipmentDetails;
