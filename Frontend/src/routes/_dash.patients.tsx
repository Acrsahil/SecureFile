import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UserPlus, UserCog, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/medshare";
import { hierarchyAPI, type User } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_dash/patients")({
    head: () => ({
        meta: [{ title: "Team & Patients — MedShare" }],
    }),
    component: PatientsAndTeam,
});

function PatientsAndTeam() {
    const [patients, setPatients] = useState<User[]>([]);
    const [unassignedPatients, setUnassignedPatients] = useState<User[]>([]);
    const [staff, setStaff] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // For assignments
    const [assigningUser, setAssigningUser] = useState<number | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<string>("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pRes, sRes, uRes] = await Promise.all([
                hierarchyAPI.myPatients(),
                hierarchyAPI.staffList(),
                hierarchyAPI.unassignedPatients(),
            ]);
            if (pRes.data) setPatients(pRes.data);
            if (sRes.data) setStaff(sRes.data);
            if (uRes.data) setUnassignedPatients(uRes.data);
        } catch (err) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (userId: number) => {
        if (!selectedStaff && selectedStaff !== "0") {
            toast.error("Select a staff member");
            return;
        }
        const staffId = selectedStaff === "0" ? null : parseInt(selectedStaff, 10);
        try {
            await hierarchyAPI.assignUser(userId, staffId);
            toast.success("Assignment updated");
            setAssigningUser(null);
            fetchData();
        } catch (err: any) {
            toast.error(err.message || "Failed to assign");
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading directory...</div>;
    }

    const UserCard = ({ u }: { u: User }) => {
        const isAssigning = assigningUser === u.id;

        return (
            <div className="flex flex-col rounded-3xl border bg-card p-5 shadow-card transition-all hover:shadow-card-hover group">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/10 font-display text-sm font-bold text-brand group-hover:bg-brand group-hover:text-primary-foreground transition-colors">
                            {u.initials}
                        </span>
                        <div>
                            <p className="font-semibold">{u.full_name}</p>
                            <p className="text-xs text-muted-foreground">{u.role_display} {u.specialty ? `· ${u.specialty}` : ""}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                            {u.document_count || 0} Docs
                        </span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t space-y-2 text-sm text-muted-foreground">
                    <p><span className="font-medium text-foreground">Email:</span> {u.email}</p>
                    {u.phone && <p><span className="font-medium text-foreground">Phone:</span> {u.phone}</p>}
                    <p>
                        <span className="font-medium text-foreground">Assigned to:</span>{" "}
                        {u.assigned_to_name || "Unassigned"}
                    </p>
                </div>

                {/* Assignment UI */}
                <div className="mt-auto pt-4 flex items-center justify-between gap-2">
                    {isAssigning ? (
                        <div className="flex w-full gap-2">
                            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select staff..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Unassigned</SelectItem>
                                    {staff.filter(s => s.id !== u.id && s.role !== "PATIENT").map(s => (
                                        <SelectItem key={s.id} value={String(s.id)}>{s.full_name} ({s.role_display})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button size="sm" className="h-8 px-3 text-xs" onClick={() => handleAssign(u.id)}>Save</Button>
                            <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => setAssigningUser(null)}>Cancel</Button>
                        </div>
                    ) : (
                        <Button variant="outline" size="sm" className="w-full text-xs h-8" onClick={() => {
                            setSelectedStaff(u.assigned_to ? String(u.assigned_to) : "0");
                            setAssigningUser(u.id);
                        }}>
                            <UserCog className="mr-1.5 h-3.5 w-3.5" /> Reassign
                        </Button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <PageHeader
                title="Directory"
                subtitle="Manage your patients and view staff hierarchy."
            />

            <div className="space-y-10 pb-8">
                {/* Patients Section */}
                <section>
                    <div className="mb-4 flex items-center gap-2 text-lg font-semibold border-b pb-2">
                        <UserPlus className="h-5 w-5 text-brand" /> My Patients ({patients.length})
                    </div>
                    {patients.length === 0 ? (
                        <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                            No patients assigned to you yet.
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {patients.map(p => <UserCard key={p.id} u={p} />)}
                        </div>
                    )}
                </section>

                {/* Unassigned Patients Section */}
                {unassignedPatients.length > 0 && (
                    <section>
                        <div className="mb-4 flex items-center gap-2 text-lg font-semibold border-b pb-2 mt-8">
                            <UserPlus className="h-5 w-5 text-muted-foreground" /> Unassigned Patients ({unassignedPatients.length})
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {unassignedPatients.map(p => <UserCard key={p.id} u={p} />)}
                        </div>
                    </section>
                )}

                {/* Staff Section */}
                <section>
                    <div className="mb-4 flex items-center gap-2 text-lg font-semibold border-b pb-2">
                        <Stethoscope className="h-5 w-5 text-brand" /> Medical Staff ({staff.length})
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {staff.map(s => (
                            <div key={s.id} className="flex flex-col rounded-3xl border bg-card p-5 shadow-sm">
                                <div className="flex items-center gap-3 border-b pb-3 mb-3">
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary font-display text-sm font-bold">
                                        {s.initials}
                                    </span>
                                    <div>
                                        <p className="font-medium">{s.full_name}</p>
                                        <p className="text-xs text-muted-foreground">{s.role_display} {s.specialty ? `· ${s.specialty}` : ""}</p>
                                    </div>
                                </div>

                                <div className="text-sm space-y-1.5 text-muted-foreground flex-1">
                                    <p className="flex justify-between"><span>Patients:</span> <span className="font-medium text-foreground">{s.patient_count || 0}</span></p>
                                    {s.role === "DOCTOR" && (
                                        <p className="flex justify-between"><span>Nurses:</span> <span className="font-medium text-foreground">{s.nurse_count || 0}</span></p>
                                    )}
                                    {s.assigned_to_name && (
                                        <p className="flex justify-between border-t pt-1.5 mt-1.5"><span>Reports to:</span> <span className="font-medium text-foreground">{s.assigned_to_name}</span></p>
                                    )}
                                </div>

                                {/* Assignment UI for STAFF */}
                                <div className="mt-4 pt-3 border-t">
                                    {assigningUser === s.id ? (
                                        <div className="flex w-full gap-2">
                                            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select doctor..." /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">None</SelectItem>
                                                    {staff.filter(st => st.id !== s.id && st.role === "DOCTOR").map(st => (
                                                        <SelectItem key={st.id} value={String(st.id)}>{st.full_name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button size="sm" className="h-8 px-3 text-xs" onClick={() => handleAssign(s.id)}>Save</Button>
                                            <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => setAssigningUser(null)}>Cancel</Button>
                                        </div>
                                    ) : (
                                        <Button variant="secondary" size="sm" className="w-full text-xs h-8" onClick={() => {
                                            setSelectedStaff(s.assigned_to ? String(s.assigned_to) : "0");
                                            setAssigningUser(s.id);
                                        }}>
                                            <UserCog className="mr-1.5 h-3.5 w-3.5" /> Reassign Supervisor
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
