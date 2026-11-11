import { useNavigate } from "react-router-dom";
import ModuleActivityCard from "./ModuleActivityCard";
import {
  MEM_MODULES,
  recordModuleVisitAllTracks,
  useModuleVisits,
  type MemTrack,
} from "@/store/memPassStore";
import { useReviewNeededCount } from "@/store/datasetStatusStore";
import { useChangesetRows } from "@/store/changesetStore";
import { mockRatingsDirectory } from "@/components/topology/mockRatingsDirectory";
import { mockProfileProjects } from "@/components/topology/mockProfileSeries";
import { mockTransactions } from "@/components/topology/mockTransactions";

const ModuleActivityMatrix = ({ track }: { track: MemTrack }) => {
  const navigate = useNavigate();
  const visits = useModuleVisits(track);

  const changesetRows = useChangesetRows();
  const topologyReview = useReviewNeededCount(
    changesetRows.map((r) => ({ id: r.id, status: r.reviewStatus })),
  );
  const ratingsReview = useReviewNeededCount(
    mockRatingsDirectory.map((r) => ({ id: r.id, status: r.status })),
  );
  const profilesReview = useReviewNeededCount(
    mockProfileProjects.map((r) => ({ id: r.submittalId, status: r.directoryStatus })),
  );

  const summaryFor = (id: string) => {
    switch (id) {
      case "topology":
        return `${topologyReview} Errors, 0 Warnings`;
      case "ratings":
        return `${ratingsReview} Errors, 0 Warnings`;
      case "profiles":
        return `${profilesReview} Errors, 0 Warnings`;
      default:
        return `${mockTransactions.length} Transactions Reviewed`;
    }
  };

  return (
    <div className="grid gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-4">
      {MEM_MODULES.map((m) => (
        <ModuleActivityCard
          key={m.id}
          id={m.id}
          label={m.label}
          summary={summaryFor(m.id)}
          visitedAt={visits[m.id]}
          onOpen={() => {
            recordModuleVisitAllTracks(m.id);
            navigate(`/?tab=${m.tab}`);
          }}
        />
      ))}
    </div>
  );
};

export default ModuleActivityMatrix;
