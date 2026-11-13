import { Download, HelpCircle, Plus, Search } from "lucide-react";
import WorkflowExplainerModal from "@/components/topology/WorkflowExplainerModal";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/AppSidebar";
import GlobalHeader from "@/components/layout/GlobalHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ChangesetTable from "@/components/topology/ChangesetTable";

import RatingsDirectory from "@/components/topology/RatingsDirectory";
import ProfilesDirectory from "@/components/topology/ProfilesDirectory";
import TransactionsTable from "@/components/topology/TransactionsTable";

import type { ProfileKindLabel } from "@/components/topology/mockProfileSeries";
import { TAB_TOOLBAR, TAB_TOOLBAR_GROUP } from "@/components/topology/toolbarStyles";

import EquipmentDetails from "@/components/topology/EquipmentDetails";
import { hasEquipmentDetailsRequired } from "@/components/topology/equipmentSchemas";
import { useReviewNeededCount } from "@/store/datasetStatusStore";
import { useChangesetRows } from "@/store/changesetStore";
import { mockRatingsDirectory } from "@/components/topology/mockRatingsDirectory";
import { mockProfileProjects } from "@/components/topology/mockProfileSeries";
import { recordModuleVisitAllTracks, MEM_MODULES, type MemModuleId } from "@/store/memPassStore";
import { usePortalView } from "@/store/portalContextStore";
import SppEngineerDashboard from "@/components/spp/SppEngineerDashboard";

const TRACKED_MODULES: MemModuleId[] = MEM_MODULES.map((m) => m.id);

/** Small crimson counter shown on a parent tab for submissions needing review. */
const ReviewNeededBadge = ({ count }: { count: number }) => {
  if (count < 1) return null;
  return (
    <span
      title={`${count} submission${count !== 1 ? "s" : ""} in Review Needed`}
      className="ml-1.5 inline-flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#FBE5E8] border border-[#C82333] text-[#C82333] text-[10px] font-bold tabular-nums"
    >
      {count}
    </span>
  );
};

const VALID_TABS = ["topology", "profiles", "ratings", "equipment", "transactions"];

const BaseReliabilityModel = () => {
  const [query, setQuery] = useState("");
  const [ratingsQuery, setRatingsQuery] = useState("");
  const [profilesQuery, setProfilesQuery] = useState("");
  const [profileKind, setProfileKind] = useState<ProfileKindLabel>("Load Gen");
  const [txQuery, setTxQuery] = useState("");
  const [showWorkflow, setShowWorkflow] = useState(false);
  
  
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

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab = tabParam && VALID_TABS.includes(tabParam) ? tabParam : "topology";

  // Opening a tracked module marks it Complete for the current MEM pass.
  useEffect(() => {
    if (TRACKED_MODULES.includes(tab as MemModuleId)) {
      recordModuleVisitAllTracks(tab as MemModuleId);
    }
  }, [tab]);

  const setTab = (v: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", v);
    setSearchParams(next, { replace: true });
  };

  const portalView = usePortalView();

  if (portalView === "SPP_ENGINEER") {
    return (
      <div className="h-screen flex flex-col w-full bg-atmo-1 overflow-hidden">
        <GlobalHeader />
        <SidebarProvider className="min-h-0 flex-1">
          <div className="flex flex-1 w-full min-h-0">
            <AppSidebar />
            <main className="flex-1 p-8 overflow-auto">
              <SppEngineerDashboard />
            </main>
          </div>
        </SidebarProvider>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col w-full bg-atmo-1 overflow-hidden">
      <GlobalHeader />
      <SidebarProvider className="min-h-0 flex-1">
        <div className="flex flex-1 w-full min-h-0">
          <AppSidebar />
          <main className="flex-1 p-8 overflow-auto">
            <h1 className="text-2xl font-semibold text-foreground mb-6">Base Reliability Model</h1>

            <Tabs value={tab} onValueChange={setTab} className="w-full">

              <div className="flex items-center justify-between border-b border-atmo-3">
                <TabsList className="bg-transparent p-0 h-auto gap-6">
                  <TabsTrigger
                    value="topology"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-atmo-10 data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-0 pb-3 text-sm font-medium text-atmo-9 gap-1.5"
                  >
                    Topology Changeset
                    <ReviewNeededBadge count={topologyReview} />
                  </TabsTrigger>
                  <TabsTrigger
                    value="profiles"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-atmo-10 data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-0 pb-3 text-sm font-medium text-atmo-9 gap-1.5"
                  >
                    Profiles
                    <ReviewNeededBadge count={profilesReview} />
                  </TabsTrigger>
                  <TabsTrigger
                    value="ratings"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-atmo-10 data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-0 pb-3 text-sm font-medium text-atmo-9 gap-1.5"
                  >
                    Ratings
                    <ReviewNeededBadge count={ratingsReview} />
                  </TabsTrigger>
                  <TabsTrigger
                    value="equipment"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-atmo-10 data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-0 pb-3 text-sm font-medium text-atmo-9 gap-1.5"
                  >
                    Equipment Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="transactions"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-atmo-10 data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none px-0 pb-3 text-sm font-medium text-atmo-9"
                  >
                    Transactions
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="topology" className="mt-6">
                <div className={TAB_TOOLBAR}>

                  <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by ID or Project Name"
                      className="h-9 pl-9 rounded-full border-atmo-4 bg-atmo-0 text-sm"
                    />
                  </div>
                  <Button asChild className="bg-brand-secondary text-brand-secondary-invert hover:bg-brand-secondary/90 rounded-full px-4 h-9 gap-1.5">
                    <Link to="/import-submission">
                      <Plus className="h-4 w-4" />
                      Import Submission
                    </Link>
                  </Button>
                </div>
                <ChangesetTable query={query} />
              </TabsContent>
              <TabsContent value="profiles" className="mt-6">
                <div className={TAB_TOOLBAR}>
                  <div className={TAB_TOOLBAR_GROUP}>


                    <div className="relative w-full max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                      <Input
                        value={profilesQuery}
                        onChange={(e) => setProfilesQuery(e.target.value)}
                        placeholder="Search by ID or Project Name…"
                        className="h-9 pl-9 rounded-full border-atmo-4 bg-atmo-0 text-sm"
                      />
                    </div>
                    <Select value={profileKind} onValueChange={(v) => setProfileKind(v as ProfileKindLabel)}>
                      <SelectTrigger className="h-9 w-[160px] rounded-full border-atmo-4 bg-atmo-0 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Load Gen">Load Gen</SelectItem>
                        <SelectItem value="Device Control">Device Control</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className={TAB_TOOLBAR_GROUP}>

                    <Button variant="outline" className="rounded-full px-4 h-9 gap-1.5 border-atmo-5 bg-atmo-0 text-foreground">
                      <Download className="h-4 w-4" />
                      Download Profiles Template (.raw)
                    </Button>
                    <Button asChild className="bg-brand-secondary text-brand-secondary-invert hover:bg-brand-secondary/90 rounded-full px-4 h-9 gap-1.5">
                      <Link to="/import-submission?kind=profiles">
                        <Plus className="h-4 w-4" />
                        Import Submission
                      </Link>
                    </Button>
                  </div>
                </div>
                <ProfilesDirectory query={profilesQuery} profileKind={profileKind} />
              </TabsContent>
              <TabsContent value="ratings" className="mt-6">
                <div className={TAB_TOOLBAR}>
                  <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                      value={ratingsQuery}
                      onChange={(e) => setRatingsQuery(e.target.value)}
                      placeholder="Search by ID or Rating Set Name"
                      className="h-9 pl-9 rounded-full border-atmo-4 bg-atmo-0 text-sm"
                    />
                  </div>
                  <div className={TAB_TOOLBAR_GROUP}>
                    <Button variant="outline" className="rounded-full px-4 h-9 gap-1.5 border-atmo-5 bg-atmo-0 text-foreground">
                      <Download className="h-4 w-4" />
                      Download Ratings Template (.raw)
                    </Button>
                    <Button asChild className="bg-brand-secondary text-brand-secondary-invert hover:bg-brand-secondary/90 rounded-full px-4 h-9 gap-1.5">
                      <Link to="/import-submission?kind=ratings">
                        <Plus className="h-4 w-4" />
                        Import Submission
                      </Link>
                    </Button>
                  </div>
                </div>
                <RatingsDirectory query={ratingsQuery} />
              </TabsContent>
              <TabsContent value="equipment" className="mt-6">
                <EquipmentDetails />
              </TabsContent>
              <TabsContent value="transactions" className="mt-6">
                <div className={TAB_TOOLBAR}>
                  <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                      value={txQuery}
                      onChange={(e) => setTxQuery(e.target.value)}
                      placeholder="Search by ID or Entity"
                      className="h-9 pl-9 rounded-full border-atmo-4 bg-atmo-0 text-sm"
                    />
                  </div>
                  <div className={TAB_TOOLBAR_GROUP}>
                    <Button
                      variant="outline"
                      onClick={() => setShowWorkflow(true)}
                      className="rounded-full px-4 h-9 gap-1.5 border-atmo-5 bg-atmo-0 text-foreground"
                    >
                      <HelpCircle className="h-4 w-4" />
                      Workflow Guide
                    </Button>
                    <Button asChild className="bg-brand-secondary text-brand-secondary-invert hover:bg-brand-secondary/90 rounded-full px-4 h-9 gap-1.5">
                      <Link to="/transaction-import">
                        <Plus className="h-4 w-4" />
                        Create Non-Firm Transaction
                      </Link>
                    </Button>
                  </div>
                </div>
                <TransactionsTable query={txQuery} />
                <WorkflowExplainerModal open={showWorkflow} onOpenChange={setShowWorkflow} />

              </TabsContent>
            </Tabs>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default BaseReliabilityModel;
