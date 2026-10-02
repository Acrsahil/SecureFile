export type Access = "View Only" | "View & Download";
export type Status = "Shared" | "Private" | "Pending" | "Revoked";

export interface MedDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  owner: string;
  sharedWith: string;
  status: Status;
  access: Access;
}

export const currentUser = {
  name: "Sahil Acharya",
  email: "sahil@medshare.app",
  role: "Patient",
  organization: "Kathmandu Medical Center",
};

export const myFiles: MedDoc[] = [
  { id: "blood-test", name: "Blood Test Report", type: "PDF", size: "1.2 MB", date: "28 Sep 2026", owner: "You", sharedWith: "Dr. Anil Sharma", status: "Shared", access: "View Only" },
  { id: "mri", name: "MRI Report", type: "DICOM", size: "24.8 MB", date: "25 Sep 2026", owner: "You", sharedWith: "Dr. Anil Sharma", status: "Shared", access: "View & Download" },
  { id: "prescription", name: "Prescription", type: "PDF", size: "340 KB", date: "21 Sep 2026", owner: "You", sharedWith: "—", status: "Private", access: "View Only" },
  { id: "xray", name: "X-Ray Report", type: "JPG", size: "3.6 MB", date: "17 Sep 2026", owner: "You", sharedWith: "Nurse Priya K.", status: "Pending", access: "View Only" },
  { id: "discharge", name: "Discharge Summary", type: "PDF", size: "890 KB", date: "10 Sep 2026", owner: "You", sharedWith: "City Hospital", status: "Revoked", access: "View Only" },
];

export const sharedWithMe: MedDoc[] = [
  { id: "mri-brain", name: "MRI Brain Report", type: "PDF", size: "18.1 MB", date: "02 Oct 2026", owner: "Dr. Anil Sharma", sharedWith: "You", status: "Shared", access: "View Only" },
  { id: "ecg", name: "ECG Analysis", type: "PDF", size: "760 KB", date: "29 Sep 2026", owner: "Dr. Meera Joshi", sharedWith: "You", status: "Shared", access: "View & Download" },
  { id: "vaccine", name: "Vaccination Record", type: "PDF", size: "210 KB", date: "15 Sep 2026", owner: "City Hospital", sharedWith: "You", status: "Shared", access: "View & Download" },
];

export const allDocs = [...myFiles, ...sharedWithMe];

export const users = ["Dr. Anil Sharma", "Dr. Meera Joshi", "Nurse Priya K.", "City Hospital", "Dr. Rohan Thapa"];

export const activity = [
  { text: "You uploaded Blood Test Report", time: "Today, 10:12", kind: "upload" },
  { text: "You shared MRI Report with Dr. Sharma", time: "Today, 09:40", kind: "share" },
  { text: "Dr. Sharma accessed MRI Report", time: "Yesterday, 18:05", kind: "access" },
  { text: "Access to Discharge Summary was revoked", time: "28 Sep, 14:22", kind: "revoke" },
  { text: "Dr. Meera Joshi shared ECG Analysis with you", time: "27 Sep, 11:30", kind: "share" },
] as const;
