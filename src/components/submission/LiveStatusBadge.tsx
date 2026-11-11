import StatusBadge from "@/components/submission/StatusBadge";
import { useDatasetStatus } from "@/store/datasetStatusStore";

/**
 * Directory-level status pill that reflects the live derived lifecycle state
 * published by the submission detail screen (any error/warning => Review Needed).
 */
const LiveStatusBadge = ({ id, status }: { id: string; status: string }) => {
  const live = useDatasetStatus(id, status);
  return <StatusBadge status={live as never} />;
};

export default LiveStatusBadge;
