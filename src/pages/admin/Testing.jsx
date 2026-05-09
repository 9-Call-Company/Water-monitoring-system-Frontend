import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const Testing = () => {
  const { showToast } = useToast();
  const [robines, setRobines] = useState([]);
  const [selectedRobineId, setSelectedRobineId] = useState('');
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [loadingRobines, setLoadingRobines] = useState(true);

  useEffect(() => {
    let isMounted = true;

    api
      .get('/robines')
      .then((response) => {
        if (!isMounted) return;
        const list = Array.isArray(response.data)
          ? response.data
          : response.data?.robines || [];
        setRobines(list);

        if (list.length > 0) {
          const first = list[0];
          setSelectedRobineId(String(first.robine_id ?? ''));
          const sourceId = first.source_id ?? first.source?.source_id ?? '';
          setSelectedSourceId(sourceId ? String(sourceId) : '');
        }
      })
      .catch(() => {
        if (isMounted) setRobines([]);
      })
      .finally(() => {
        if (isMounted) setLoadingRobines(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRobineChange = (event) => {
    const nextId = event.target.value;
    setSelectedRobineId(nextId);
    const selected = robines.find((item) => String(item.robine_id) === nextId);
    const sourceId = selected?.source_id ?? selected?.source?.source_id ?? '';
    setSelectedSourceId(sourceId ? String(sourceId) : '');
  };

  const handleTest = async (scenario) => {
    if (!selectedRobineId) {
      showToast('Select a robine to test.', 'error');
      return;
    }

    const payload = {
      scenario,
      robine_id: Number(selectedRobineId),
      source_id: selectedSourceId ? Number(selectedSourceId) : undefined,
    };

    try {
      const response = await api.post('/testing/simulate', payload);
      showToast(response.data.message, 'success');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred during the test.';
      showToast(errorMessage, 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Testing</h1>
        <p className="text-sm text-gray-400">
          Choose a robine to target, then click a scenario to simulate it.
        </p>
      </div>

      <div className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-5">
        <h2 className="text-sm font-medium text-white mb-3">Target Robine</h2>
        {loadingRobines ? (
          <p className="text-xs text-gray-500">Loading robines...</p>
        ) : robines.length === 0 ? (
          <p className="text-xs text-gray-500">No robines found to test.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs text-gray-400">Robine</label>
              <select
                className="mt-2 w-full rounded-lg border border-[#1E1E1E] bg-[#0D0D0D] px-3 py-2 text-sm text-white"
                value={selectedRobineId}
                onChange={handleRobineChange}
              >
                {robines.map((item) => (
                  <option key={item.robine_id} value={item.robine_id}>
                    #{item.robine_id} - {item.district || 'Unknown'} {item.cell || ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Source</label>
              <input
                readOnly
                value={selectedSourceId || 'N/A'}
                className="mt-2 w-full rounded-lg border border-[#1E1E1E] bg-[#0D0D0D] px-3 py-2 text-sm text-gray-300"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-4">
          <h2 className="text-lg font-semibold text-white mb-2">Normal Flow</h2>
          <p className="text-xs text-gray-500 mb-4">
            Simulates normal water flow without any issues.
          </p>
          <button
            onClick={() => handleTest('normal')}
            className="w-full rounded-md bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
          >
            Test Normal Flow
          </button>
        </div>
        <div className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-4">
          <h2 className="text-lg font-semibold text-white mb-2">No Water</h2>
          <p className="text-xs text-gray-500 mb-4">
            Simulates the source being closed or empty.
          </p>
          <button
            onClick={() => handleTest('no_water')}
            className="w-full rounded-md bg-yellow-500 px-4 py-2 text-sm text-white hover:bg-yellow-600"
          >
            Test No Water
          </button>
        </div>
        <div className="rounded-2xl border border-[#1E1E1E] bg-[#111111] p-4">
          <h2 className="text-lg font-semibold text-white mb-2">Pipe Problem</h2>
          <p className="text-xs text-gray-500 mb-4">
            Simulates a blockage or pipe issue between sensors.
          </p>
          <button
            onClick={() => handleTest('pipe_problem')}
            className="w-full rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
          >
            Test Pipe Problem
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testing;
