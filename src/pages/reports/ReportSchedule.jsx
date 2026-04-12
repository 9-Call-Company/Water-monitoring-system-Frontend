import { useState } from 'react';
import { CalendarClock, FileText, CheckCircle2 } from 'lucide-react';

const ReportSchedule = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call to save schedule
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold leading-7 text-slate-900">Report Scheduling</h2>
        <p className="text-slate-500 mt-2 text-sm">Automate your water usage and system health summaries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm border border-slate-200 rounded-lg">
            <div className="px-6 py-5 border-b border-slate-200">
              <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-primary-500" />
                New Schedule
              </h3>
            </div>
            <div className="px-6 py-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Frequency</label>
                    <select className="mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm border">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Time of Day</label>
                    <input type="time" defaultValue="08:00" className="mt-1 block w-full rounded-md border-slate-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm border" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Included Content</label>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex h-5 items-center">
                          <input id="usage" type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="usage" className="font-medium text-slate-700">Total Liters Used</label>
                          <p className="text-slate-500">Aggregate consumption data for your household/community.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex h-5 items-center">
                          <input id="issues" type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="issues" className="font-medium text-slate-700">Pipe Issues & Alerts</label>
                          <p className="text-slate-500">List of any detected leaks, pressure drops, or maintenance events.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  {isSubmitted ? (
                    <span className="text-emerald-600 flex items-center text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 mr-1.5" /> Schedule Saved
                    </span>
                  ) : <div></div>}
                  <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    Save Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm border border-slate-200 rounded-lg">
            <div className="px-6 py-5 border-b border-slate-200">
              <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-400" />
                Active Schedules
              </h3>
            </div>
            <ul className="divide-y divide-slate-200">
              <li className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">Weekly Digest</h4>
                    <p className="text-xs text-slate-500 mt-1">Every Monday at 08:00 AM</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                    Active
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSchedule;
