export const mapStatusToBackend = (status: string): string => {
  const map: Record<string, string> = {
    new: "NEW",
    in_progress: "IN_PROGRESS",
    completed: "CONVERTED",
    rejected: "NOT_INTERESTED",
    interested: "INTERESTED",
    unreachable: "UNREACHABLE",
    kp_sent: "KP_SENT",
    lpr_found: "LPR_FOUND",
    callback: "CALLBACK",
    order: "ORDER",
    called: "IN_PROGRESS", // 'called' is usually in progress
    noanswer: "NO_ANSWER",
    bad_number: "BAD_NUMBER",
    client: "CLIENT",
  };
  return map[status] || status.toUpperCase();
};

export const mapStatusToFrontend = (status: string): string => {
  const map: Record<string, string> = {
    NEW: "new",
    IN_PROGRESS: "in_progress",
    CONVERTED: "completed",
    NOT_INTERESTED: "rejected",
    INTERESTED: "interested",
    UNREACHABLE: "unreachable",
    KP_SENT: "kp_sent",
    LPR_FOUND: "lpr_found",
    CALLBACK: "callback",
    ORDER: "order",
    NO_ANSWER: "noanswer",
    BAD_NUMBER: "bad_number",
    CLIENT: "client",
  };
  return map[status] || status.toLowerCase();
};
