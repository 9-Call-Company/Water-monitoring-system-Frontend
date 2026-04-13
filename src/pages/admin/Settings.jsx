import ActionBtn from "../../components/shared/ActionBtn";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Update profile details and notification preferences.
        </p>
      </div>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <h2 className="text-sm font-medium text-white">Profile form</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {["Full name", "Email", "Telephone", "Province"].map((label) => (
              <label key={label} className="text-xs text-zinc-400">
                {label}
                <input className="mt-2 w-full rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-sm text-white outline-none" />
              </label>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <ActionBtn label="Save Profile" variant="success" />
          </div>
        </div>

        <div className="rounded-2xl border border-wcam-border bg-wcam-card p-5">
          <h2 className="text-sm font-medium text-white">
            Notification preferences
          </h2>
          <div className="mt-4 space-y-3 text-sm text-zinc-400">
            {[
              "Email alerts",
              "SMS alerts",
              "System alerts",
              "Maintenance reminders",
            ].map((label) => (
              <label
                key={label}
                className="flex items-center justify-between rounded-xl border border-wcam-border bg-[#141414] px-4 py-3"
              >
                <span>{label}</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 accent-[#FF6B00]"
                />
              </label>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <ActionBtn label="Save Settings" />
          </div>
        </div>
      </section>
    </div>
  );
}
