import { useState, useEffect } from "react";
import { X, Plus, Trash2, Users, Loader2 } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import {
	getSourceAgents,
	assignAgentToSource,
	removeAgentFromSource,
} from "../../services/sourceService";
import { getUsers } from "../../services/userService";

const AssignAgentModal = ({ sourceId, sourceName, isOpen, onClose, onUpdate }) => {
	const { showToast } = useToast();
	const [assignedAgents, setAssignedAgents] = useState([]);
	const [availableAgents, setAvailableAgents] = useState([]);
	const [selectedAgent, setSelectedAgent] = useState("");
	const [loading, setLoading] = useState(false);
	const [assigningId, setAssigningId] = useState(null);
	const [removingId, setRemovingId] = useState(null);

	useEffect(() => {
		if (isOpen && sourceId) {
			fetchData();
		}
	}, [isOpen, sourceId]);

	const fetchData = async () => {
		setLoading(true);
		try {
			// Get assigned agents
			const agentsRes = await getSourceAgents(sourceId);
			setAssignedAgents(agentsRes.data.agents || []);

			// Get all users (agents only)
			const usersRes = await getUsers();
			const agents = usersRes.data.users.filter((u) => u.role === "agent");

			// Filter out already assigned agents
			const assignedIds = (agentsRes.data.agents || []).map((a) => a.user_id);
			const available = agents.filter((a) => !assignedIds.includes(a.user_id));
			setAvailableAgents(available);
		} catch (err) {
			showToast("Failed to load agents", "error");
		} finally {
			setLoading(false);
		}
	};

	const handleAssignAgent = async () => {
		if (!selectedAgent) {
			showToast("Please select an agent", "error");
			return;
		}

		setAssigningId(parseInt(selectedAgent));
		try {
			await assignAgentToSource(sourceId, parseInt(selectedAgent));
			showToast("Agent assigned successfully", "success");
			setSelectedAgent("");
			fetchData();
			if (onUpdate) onUpdate();
		} catch (err) {
			showToast(err.response?.data?.message || "Failed to assign agent", "error");
		} finally {
			setAssigningId(null);
		}
	};

	const handleRemoveAgent = async (agentId) => {
		setRemovingId(agentId);
		try {
			await removeAgentFromSource(sourceId, agentId);
			showToast("Agent removed successfully", "success");
			fetchData();
			if (onUpdate) onUpdate();
		} catch (err) {
			showToast(err.response?.data?.message || "Failed to remove agent", "error");
		} finally {
			setRemovingId(null);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-2">
						<Users className="w-5 h-5 text-[#FF6B00]" />
						<div>
							<h2 className="text-lg font-bold text-white">Manage Agents</h2>
							<p className="text-xs text-gray-500">{sourceName}</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-1 hover:bg-[#1E1E1E] rounded-lg transition-colors"
					>
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				{loading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
					</div>
				) : (
					<>
						{/* Assigned Agents Section */}
						<div className="mb-6">
							<h3 className="text-xs uppercase tracking-wide text-gray-500 font-mono mb-3">
								Assigned Agents ({assignedAgents.length})
							</h3>
							{assignedAgents.length === 0 ? (
								<p className="text-xs text-gray-600 py-3">No agents assigned yet</p>
							) : (
								<div className="space-y-2">
									{assignedAgents.map((agent) => (
										<div
											key={agent.user_id}
											className="flex items-center justify-between bg-[#0D0D0D] border border-[#1E1E1E] rounded-lg p-3"
										>
											<div className="flex-1 min-w-0">
												<p className="text-sm text-white font-semibold truncate">
													{agent.full_name}
												</p>
												<p className="text-xs text-gray-500 truncate">{agent.email}</p>
											</div>
											<button
												onClick={() => handleRemoveAgent(agent.user_id)}
												disabled={removingId === agent.user_id}
												className="ml-2 p-1.5 text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50"
											>
												{removingId === agent.user_id ? (
													<Loader2 className="w-4 h-4 animate-spin" />
												) : (
													<Trash2 className="w-4 h-4" />
												)}
											</button>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Add Agent Section */}
						<div className="border-t border-[#1E1E1E] pt-6">
							<h3 className="text-xs uppercase tracking-wide text-gray-500 font-mono mb-3">
								Add Agent
							</h3>
							{availableAgents.length === 0 ? (
								<p className="text-xs text-gray-600 py-3">All agents are already assigned</p>
							) : (
								<div className="space-y-3">
									<select
										value={selectedAgent}
										onChange={(e) => setSelectedAgent(e.target.value)}
										className="w-full bg-[#0D0D0D] border border-[#1E1E1E] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FF6B00]"
									>
										<option value="">Select an agent...</option>
										{availableAgents.map((agent) => (
											<option key={agent.user_id} value={agent.user_id}>
												{agent.full_name} ({agent.email})
											</option>
										))}
									</select>
									<button
										onClick={handleAssignAgent}
										disabled={!selectedAgent || assigningId}
										className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e05f00] disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:cursor-not-allowed"
									>
										{assigningId ? (
											<>
												<Loader2 className="w-4 h-4 animate-spin" />
												Assigning...
											</>
										) : (
											<>
												<Plus className="w-4 h-4" />
												Assign Agent
											</>
										)}
									</button>
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default AssignAgentModal;
