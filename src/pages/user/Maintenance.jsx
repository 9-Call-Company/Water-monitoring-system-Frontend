import Badge from "../../components/shared/Badge";
import ActionBtn from "../../components/shared/ActionBtn";

const requests = [
  {
    title: "Pipe leak",
    date: "Apr 11",
    status: "open",
    description: "Leak near the kitchen line.",
  },
  {
    title: "Valve problem",
    date: "Apr 09",
    status: "resolved",
    description: "Valve replaced and tested.",
  },
];

export default function Maintenance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Maintenance requests
        </h1>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-2xl border border-wcam-border bg-wcam-card p-5 space-y-3">
          <input
            className="w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2"
            placeholder="Issue type"
          />
          <textarea
            className="w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2"
            rows={4}
            placeholder="Describe the issue"
          />
          <input
            className="w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2"
            placeholder="Urgency"
          />
          <ActionBtn label="Submit Request" variant="success" />
        </section>

        <section className="space-y-3 rounded-2xl border border-wcam-border bg-wcam-card p-5">
          {requests.map((request) => (
            <div
              key={request.title}
              className="rounded-xl border border-wcam-border bg-[#141414] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-white">{request.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">{request.date}</p>
                </div>
                <Badge
                  type={
                    request.status === "resolved"
                      ? "resolved"
                      : request.status === "in_progress"
                        ? "warning"
                        : "critical"
                  }
                  label={request.status}
                />
              </div>
              <p className="mt-3 text-sm text-zinc-400">
                {request.description}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
