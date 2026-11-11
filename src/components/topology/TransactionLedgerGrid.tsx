import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { txLedgerRows, type TxLedgerRow, type DeltaValue, type CellAction } from "./transactionDetailMock";

const TH_BASE =
  "h-8 px-2 text-[11px] font-semibold uppercase tracking-wide text-atmo-10 border border-[#E2E8F0] bg-atmo-1 whitespace-nowrap";
const TD_BASE =
  "h-8 px-2 text-xs text-atmo-10 border border-[#E2E8F0] whitespace-nowrap";

const STICKY_OFFSETS = [0, 56, 124]; // CELL, ID, NO CHANGE
const STICKY_WIDTHS = [56, 68, 70];

const ACTION_STYLES: Record<CellAction, string> = {
  ADD: "bg-[#D7E6CF] text-[#1F4D1F]",
  MOD: "bg-[#FBF2D8] text-[#4D4D4D]",
  DEL: "bg-[#F6DCDD] text-[#DC2626]",
  NONE: "bg-transparent text-atmo-8",
};

const Flag = ({ on }: { on: boolean }) => (
  <span
    className={cn(
      "inline-flex items-center justify-center rounded-sm px-1.5 py-0.5 text-[10px] font-semibold",
      on ? "bg-[#D7E6CF] text-[#1F4D1F]" : "bg-atmo-2 text-atmo-9",
    )}
  >
    {on ? "Yes" : "No"}
  </span>
);

const isDelta = (v: unknown): v is DeltaValue =>
  typeof v === "object" && v !== null && "next" in (v as object);

const NumCell = ({ value, action }: { value: number | DeltaValue; action: CellAction }) => {
  if (isDelta(value)) {
    return (
      <span className="tabular-nums inline-flex items-center gap-1 text-[#4D4D4D]">
        <span className="line-through text-atmo-8">{value.prev}</span>
        <ArrowRight className="h-3 w-3" />
        <span className="font-semibold">{value.next}</span>
      </span>
    );
  }
  return <span className="tabular-nums">{value}</span>;
};

interface Props {
  rows?: TxLedgerRow[];
}

const colGroup = (label: string, span: number, color: string) => (
  <th
    colSpan={span}
    className="h-7 px-2 text-[10px] font-bold uppercase tracking-wider text-atmo-10 border border-[#E2E8F0] text-center"
    style={{ backgroundColor: color }}
  >
    {label}
  </th>
);

const TransactionLedgerGrid = ({ rows = txLedgerRows }: Props) => {
  return (
    <div className="bg-atmo-0 border border-atmo-4 rounded-md overflow-hidden w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-max border-collapse text-xs">
          <thead>
            <tr>
              {/* Sticky group header (3 cols) */}
              <th
                colSpan={3}
                className="sticky left-0 z-30 h-7 px-2 text-[10px] font-bold uppercase tracking-wider text-atmo-10 border border-[#E2E8F0] text-center bg-[#EDEFF2]"
              >
                Primary Identifiers
              </th>
              {colGroup("EDST Control & Disposition", 6, "#F0E8F3")}
              {colGroup("Footprint & Contract Boundaries", 11, "#E8F1F0")}
              {colGroup("Market Schedule Key Protocols", 13, "#F1EEE8")}
              {colGroup("Seasonal & Scenario Codes", 18, "#E8EEF6")}
            </tr>
            <tr>
              {/* Sticky cols */}
              {["CELL", "ID", "NO CHANGE"].map((h, i) => (
                <th
                  key={h}
                  className={cn(TH_BASE, "sticky z-20 text-center")}
                  style={{
                    left: STICKY_OFFSETS[i],
                    minWidth: STICKY_WIDTHS[i],
                    width: STICKY_WIDTHS[i],
                  }}
                >
                  {h}
                </th>
              ))}
              {[
                "SUBMITTAL YEAR",
                "ACTION",
                "DISPOSITION",
                "CHANGESET ID",
                "PREVIOUS CHANGESET ID",
                "RECORD KEY",
                "RESPONSIBLE ENTITY NAME",
                "RE ACK",
                "CONFIRMING ENTITY NAME",
                "CE ACK",
                "REGION NAME",
                "FROM AREA NAME",
                "FROM AREA ID",
                "ATTRIBUTE 1",
                "TO AREA NAME",
                "TO AREA ID",
                "ATTRIBUTE 2",
                "OASIS NUMBER",
                "LINK NUMBER",
                "PRIMARY FUEL TYPE",
                "SECONDARY FUEL TYPE",
                "PLANT",
                "START TIME",
                "STOP TIME",
                "MW CAPACITY",
                "ROLL OVER RIGHTS",
                "SCENARIO 0 SCALABLE",
                "FIRM",
                "RELATED REFERENCE",
                "27G","27S","27F","27W","28G","28L","28S","28F","28W","29L","29S","31L","31S","31SH","31W","36S","36W","36L",
              ].map((h) => (
                <th key={h} className={TH_BASE}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const zebra = idx % 2 === 1;
              const stickyBg = zebra ? "#F4F6F8" : "#FFFFFF";
              return (
                <tr key={row.id} className={cn(zebra && "bg-[#F4F6F8]")}>
                  <td
                    className={cn(TD_BASE, "sticky z-10 text-center text-atmo-8 tabular-nums")}
                    style={{ left: STICKY_OFFSETS[0], minWidth: STICKY_WIDTHS[0], background: stickyBg }}
                  >
                    {idx + 1}
                  </td>
                  <td
                    className={cn(TD_BASE, "sticky z-10 font-mono text-[11px]")}
                    style={{ left: STICKY_OFFSETS[1], minWidth: STICKY_WIDTHS[1], background: stickyBg }}
                  >
                    {row.id}
                  </td>
                  <td
                    className={cn(TD_BASE, "sticky z-10 text-center")}
                    style={{ left: STICKY_OFFSETS[2], minWidth: STICKY_WIDTHS[2], background: stickyBg }}
                  >
                    <Flag on={row.noChange} />
                  </td>

                  <td className={cn(TD_BASE, "tabular-nums text-right")}>{row.submittalYear}</td>
                  <td className={TD_BASE}>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-bold",
                        ACTION_STYLES[row.action],
                      )}
                    >
                      {row.action}
                    </span>
                  </td>
                  <td className={TD_BASE}>{row.disposition}</td>
                  <td className={cn(TD_BASE, "font-mono text-[11px]")}>{row.changesetId}</td>
                  <td className={cn(TD_BASE, "font-mono text-[11px] text-atmo-8")}>{row.prevChangesetId}</td>
                  <td className={cn(TD_BASE, "font-mono text-[11px]")}>{row.recordKey}</td>

                  <td className={TD_BASE}>{row.responsibleEntity}</td>
                  <td className={cn(TD_BASE, "text-center")}><Flag on={row.reAck} /></td>
                  <td className={TD_BASE}>{row.confirmingEntity}</td>
                  <td className={cn(TD_BASE, "text-center")}><Flag on={row.ceAck} /></td>
                  <td className={TD_BASE}>{row.regionName}</td>
                  <td className={TD_BASE}>{row.fromAreaName}</td>
                  <td className={cn(TD_BASE, "tabular-nums")}>{row.fromAreaId}</td>
                  <td className={TD_BASE}>{row.attr1}</td>
                  <td className={TD_BASE}>{row.toAreaName}</td>
                  <td className={cn(TD_BASE, "tabular-nums")}>{row.toAreaId}</td>
                  <td className={TD_BASE}>{row.attr2}</td>

                  <td className={cn(TD_BASE, "font-mono text-[11px]")}>{row.oasisNumber}</td>
                  <td className={cn(TD_BASE, "font-mono text-[11px]")}>{row.linkNumber}</td>
                  <td className={TD_BASE}>{row.primaryFuel}</td>
                  <td className={TD_BASE}>{row.secondaryFuel}</td>
                  <td className={TD_BASE}>{row.plant}</td>
                  <td className={cn(TD_BASE, "tabular-nums")}>{row.startTime}</td>
                  <td className={cn(TD_BASE, "tabular-nums")}>{row.stopTime}</td>
                  <td className={cn(TD_BASE, "text-right")}>
                    <NumCell value={row.mwCapacity} action={row.action} />
                  </td>
                  <td className={cn(TD_BASE, "text-center")}><Flag on={row.rollOverRights} /></td>
                  <td className={cn(TD_BASE, "text-center")}><Flag on={row.scenario0Scalable} /></td>
                  <td className={cn(TD_BASE, "text-center")}><Flag on={row.firm} /></td>
                  <td className={cn(TD_BASE, "font-mono text-[11px]")}>{row.relatedReference}</td>

                  {[row.s27G,row.s27S,row.s27F,row.s27W,row.s28G,row.s28L,row.s28S,row.s28F,row.s28W,row.s29L,row.s29S,row.s31L,row.s31S,row.s31SH,row.s31W,row.s36S,row.s36W,row.s36L].map((v, i) => (
                    <td key={i} className={cn(TD_BASE, "text-right tabular-nums")}>{v}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionLedgerGrid;
