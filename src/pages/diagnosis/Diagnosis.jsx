import { useEffect, useMemo, useState } from "react";
import { Activity, Loader2, ShieldCheck, TriangleAlert } from "lucide-react";
import api from "../../services/api";
import { getLatestSensorData } from "../../services/sensorService";
import { useSocket } from "../../contexts/SocketContext";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

const badgeStyles = {
	good: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
	warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
	danger: "border-red-500/30 bg-red-500/10 text-red-300",
	muted: "border-white/10 bg-white/5 text-gray-300",
};

const Modal = ({ open, onClose, title, status, diagnosis, isDiagnosing }) => {
	if (!open) return null;

	const bannerClass =
		diagnosis.level === "good"
			? "from-emerald-500/20 to-emerald-500/5 border-emerald-400/20"
			: diagnosis.level === "danger"
				? "from-rose-500/20 to-rose-500/5 border-rose-400/20"
				: diagnosis.level === "warning"
					? "from-amber-500/20 to-amber-500/5 border-amber-400/20"
					: "from-slate-500/20 to-slate-500/5 border-slate-400/20";

	const isHealthy = diagnosis.level === "good";

	return (
		<div className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md">
			<div className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-[#101010] shadow-[0_30px_90px_rgba(0,0,0,0.7)]">
				<div className={`border-b bg-gradient-to-r px-6 py-6 ${bannerClass}`}>
					<div className="flex items-start justify-between gap-4">
						<div>
							<p className="text-[11px] uppercase tracking-[0.3em] text-gray-400">
								Real-time diagnosis
							</p>
							<h2 className="mt-2 text-3xl font-semibold text-white">{title}</h2>
						</div>
						<button
							onClick={onClose}
							className="rounded-xl border border-white/15 bg-black/25 px-4 py-2 text-sm font-medium text-gray-100 hover:bg-black/40 hover:text-white"
						>
							Close
						</button>
					</div>
				</div>

				<div className="grid gap-5 p-6 md:grid-cols-[1.25fr_0.75fr]">
					<div className="rounded-3xl border border-white/10 bg-[#151515] p-5">
						<div className="flex items-center justify-between gap-3">
							<div
								className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${badgeStyles[diagnosis.level]}`}
							>
								{isDiagnosing ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : isHealthy ? (
									<ShieldCheck className="h-4 w-4" />
								) : (
									<TriangleAlert className="h-4 w-4" />
								)}
								{status}
							</div>
							<div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-gray-300">
								Auto-updated from sensors
							</div>
						</div>

						<div className="mt-5 rounded-3xl border border-white/10 bg-black/30 p-5">
							{isDiagnosing ? (
								<div className="flex items-center gap-3">
									<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF6B00]/15 text-[#FF6B00]">
										<Loader2 className="h-6 w-6 animate-spin" />
									</div>
									<div>
										<div className="text-base font-semibold text-white">Diagnosing...</div>
										<div className="mt-1 text-sm text-gray-300">
											Checking source and water flow in real time.
										</div>
									</div>
								</div>
							) : isHealthy ? (
								<div className="flex items-center gap-3">
									<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
										<ShieldCheck className="h-6 w-6" />
									</div>
									<div>
										<div className="text-base font-semibold text-white">No problem detected</div>
										<div className="mt-1 text-sm text-emerald-300/90">
											Water is flowing normally and the source is healthy.
										</div>
									</div>
								</div>
							) : (
								<div className="flex items-center gap-3">
									<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-300">
										<TriangleAlert className="h-6 w-6" />
									</div>
									<div>
										<div className="text-base font-semibold text-white">Problem detected</div>
										<div className="mt-1 text-sm text-rose-300/90">
											Water flow stopped while the source is active.
										</div>
									</div>
								</div>
							)}

							<div className="mt-5 space-y-3">
								<p className="text-sm leading-6 text-gray-100">{diagnosis.message}</p>
								<p className="text-xs leading-5 text-gray-400">{diagnosis.detail}</p>
							</div>
						</div>
					</div>

					<div className="rounded-3xl border border-white/10 bg-[#121212] p-5">
						<div className="flex items-center gap-2 text-sm font-medium text-white">
							<Activity className="h-4 w-4 text-[#FF6B00]" />
							Live signal
						</div>
						<div className="mt-4 space-y-3 text-sm text-gray-300">
							<div className="rounded-2xl border border-white/10 bg-black/30 p-4">
								<div className="text-[10px] uppercase tracking-[0.25em] text-gray-500">Source</div>
								<div className="mt-1 text-base font-medium text-white">{diagnosis.sourceName || "—"}</div>
							</div>
							<div className="rounded-2xl border border-white/10 bg-black/30 p-4">
								<div className="text-[10px] uppercase tracking-[0.25em] text-gray-500">Flow</div>
								<div className="mt-1 text-sm text-white">{diagnosis.flowText}</div>
							</div>
							<div className="rounded-2xl border border-white/10 bg-black/30 p-4">
								<div className="text-[10px] uppercase tracking-[0.25em] text-gray-500">Sensor status</div>
								<div className="mt-1 text-sm capitalize text-white">{diagnosis.sensorStatus || "waiting"}</div>
							</div>
						</div>
					</div>
				</div>

				<div className="border-t border-white/10 px-6 py-4 text-xs text-gray-500">
					The modal updates automatically from live socket events.
				</div>
			</div>
		</div>
	);
};

const buildDiagnosis = ({ source, reading }) => {
	const sourceName = source?.source_name || reading?.source?.source_name || "Assigned source";
	const sourceStatus = (source?.status || reading?.source?.status || "unknown").toLowerCase();
	const flowIn = Number(reading?.flow_in || 0);
	const flowOut = Number(reading?.flow_out || 0);
	const valveInlet = String(reading?.valve_inlet || "").toLowerCase();
	const hasReading = Boolean(reading);
	const isFlowing =
		sourceStatus === "active" && flowIn > 0.05 && flowOut > 0.05 && valveInlet !== "closed";

	if (sourceStatus !== "active") {
		return {
			level: "warning",
			sourceName,
			sensorStatus: sourceStatus,
			flowText: "Source is inactive",
			message: "The source is currently inactive. Diagnosis is paused until the source becomes active.",
			detail: "Once the source is opened, the system will resume live troubleshooting automatically.",
		};
	}

	if (!hasReading) {
		return {
			level: "muted",
			sourceName,
			sensorStatus: "waiting",
			flowText: "Waiting for live sensor data",
			message: "Troubleshoot is ready. Open the popup and wait for the first live reading.",
			detail: "The diagnosis view will update automatically as soon as the sensor reports a value.",
		};
	}

	if (reading?.sensor_status === "pipe_problem" || (!isFlowing && sourceStatus === "active")) {
		return {
			level: "danger",
			sourceName,
			sensorStatus: reading?.sensor_status || "pipe_problem",
			flowText: `Flow stopped: inlet ${flowIn.toFixed(2)} L/min, outlet ${flowOut.toFixed(2)} L/min`,
			message: "Problem detected. Pipe is damaged or water flow has stopped.",
			detail: "Please inspect the pipe and restore water flow. The diagnosis view will switch back to green once flow resumes.",
		};
	}

	if (isFlowing) {
		return {
			level: "good",
			sourceName,
			sensorStatus: reading?.sensor_status || "flowing",
			flowText: `Water flowing normally: inlet ${flowIn.toFixed(2)} L/min, outlet ${flowOut.toFixed(2)} L/min`,
			message: "No problem detected. Everything is okay and water is flowing normally.",
			detail: "This state is refreshed in real time from the water flow sensors.",
		};
	}

	return {
		level: "muted",
		sourceName,
		sensorStatus: reading?.sensor_status || "waiting",
		flowText: "Waiting for live sensor data",
		message: "Troubleshoot is ready. Open the source or wait for the next sensor update.",
		detail: "The diagnosis panel will update automatically when live data arrives.",
	};
};

const buildTroubleshootDiagnosis = ({ source, reading, robineState }) => {
	const sourceName = source?.source_name || reading?.source?.source_name || "Assigned source";
	const sourceStatus = (source?.status || reading?.source?.status || "unknown").toLowerCase();
	const flowIn = Number(reading?.flow_in || 0);
	const flowOut = Number(reading?.flow_out || 0);
	const isFlowing = flowIn > 0.05 && flowOut > 0.05;

	if (robineState !== "open") {
		return {
			level: "good",
			sourceName,
			sensorStatus: "healthy",
			flowText: "Default mode",
			message: "No problem detected. Robine is in default mode.",
			detail: "Select 'Open robine' and click Troubleshoot to run live diagnosis.",
		};
	}

	if (sourceStatus === "active" && isFlowing) {
		return {
			level: "good",
			sourceName,
			sensorStatus: reading?.sensor_status || "flowing",
			flowText: `Water flowing: inlet ${flowIn.toFixed(2)} L/min, outlet ${flowOut.toFixed(2)} L/min`,
			message: "No problem detected.",
			detail: "Source is open and water is flowing normally.",
		};
	}

	if (sourceStatus === "active" && !isFlowing) {
		return {
			level: "danger",
			sourceName,
			sensorStatus: reading?.sensor_status || "pipe_problem",
			flowText: `No flow: inlet ${flowIn.toFixed(2)} L/min, outlet ${flowOut.toFixed(2)} L/min`,
			message: "Problem detected.",
			detail: "Source is open but no water is flowing. This indicates a pipe problem.",
		};
	}

	return {
		level: "warning",
		sourceName,
		sensorStatus: sourceStatus || "inactive",
		flowText: "Source is inactive",
		message: "No available water in source.",
		detail: "This is normal when the source is not open.",
	};
};

export default function Diagnosis() {
	const socket = useSocket();
	const { showToast } = useToast();
	const { user } = useAuth();

	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [source, setSource] = useState(null);
	const [reading, setReading] = useState(null);
	const [lastUpdated, setLastUpdated] = useState(null);
	const [robineState, setRobineState] = useState("default");
	const [isDiagnosing, setIsDiagnosing] = useState(false);
	const [diagnosis, setDiagnosis] = useState({
		level: "good",
		sourceName: "Assigned source",
		sensorStatus: "healthy",
		flowText: "Default mode",
		message: "No problem detected. System is healthy.",
		detail: "Select 'Open robine' and click Troubleshoot to run live diagnosis.",
	});

	const liveDiagnosis = useMemo(() => buildDiagnosis({ source, reading }), [source, reading]);
	const dashboardDiagnosis = useMemo(() => {
		if (robineState === "default") {
			return {
				level: "good",
				sourceName: source?.source_name || liveDiagnosis.sourceName,
				sensorStatus: "healthy",
				flowText: "Default mode",
				message: "No problem detected. System is healthy.",
				detail: "Select 'Open robine' and click Troubleshoot to run live diagnosis.",
			};
		}

		return liveDiagnosis;
	}, [robineState, source?.source_name, liveDiagnosis]);

	useEffect(() => {
		if (modalOpen && !isDiagnosing && robineState === "open") {
			setDiagnosis(buildTroubleshootDiagnosis({ source, reading, robineState }));
		}
	}, [modalOpen, isDiagnosing, robineState, source, reading]);

	useEffect(() => {
		let alive = true;

		const fetchInitial = async () => {
			setLoading(true);
			try {
				const [sourcesRes, robinesRes] = await Promise.all([
					api.get("/sources").catch(() => ({ data: [] })),
					api.get("/robines").catch(() => ({ data: [] })),
				]);

				const sources = Array.isArray(sourcesRes.data) ? sourcesRes.data : [];
				const robines = Array.isArray(robinesRes.data) ? robinesRes.data : [];
				const userRole = (user?.role || "user").toLowerCase();

				const preferredRobine =
					robines.find((item) =>
						userRole === "user"
							? item.user_id === user?.userId
							: userRole === "agent"
								? item.agent_id === user?.userId
								: true,
					) || robines[0] || null;

				const preferredSourceId =
					preferredRobine?.source_id || preferredRobine?.source?.source_id || sources[0]?.source_id || null;

				const preferredSource =
					sources.find((item) => item.source_id === preferredSourceId) ||
					preferredRobine?.source ||
					sources[0] ||
					null;

				if (!alive) return;

				setSource(preferredSource);

				if (preferredSource?.source_id) {
					const latestRes = await getLatestSensorData(preferredSource.source_id).catch(() => null);
					if (!alive) return;
					setReading(latestRes?.data || null);
					setLastUpdated(latestRes?.data?.recorded_at || new Date().toISOString());
				}
			} catch (error) {
				if (!alive) return;
				showToast(error.response?.data?.message || "Failed to load diagnosis", "error");
			} finally {
				if (alive) setLoading(false);
			}
		};

		fetchInitial();

		return () => {
			alive = false;
		};
	}, [showToast, user?.role, user?.userId]);

	useEffect(() => {
		if (!socket) return undefined;

		const onReading = (payload) => {
			if (!payload?.source_id) return;
			if (source?.source_id && payload.source_id !== source.source_id) return;

			setReading((prev) => ({
				...prev,
				...payload,
				source: {
					...(prev?.source || {}),
					source_name: payload.source_name || prev?.source?.source_name,
					status: payload.source_status || prev?.source?.status,
				},
			}));
			setLastUpdated(payload.recorded_at || new Date().toISOString());
		};

		const onSourceOpened = (payload) => {
			if (!payload?.source_id) return;
			if (source?.source_id && payload.source_id !== source.source_id) return;

			setSource((prev) => (prev ? { ...prev, status: "active" } : prev));
			showToast(payload.message || "Source opened", "success");
		};

		const onSourceClosed = (payload) => {
			if (!payload?.source_id) return;
			if (source?.source_id && payload.source_id !== source.source_id) return;

			setSource((prev) => (prev ? { ...prev, status: "inactive" } : prev));
			showToast(payload.message || "Source closed", "warning");
		};

		socket.on("sensor:reading", onReading);
		socket.on("source:opened", onSourceOpened);
		socket.on("source:closed", onSourceClosed);

		return () => {
			socket.off("sensor:reading", onReading);
			socket.off("source:opened", onSourceOpened);
			socket.off("source:closed", onSourceClosed);
		};
	}, [socket, source?.source_id, showToast]);

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
				<Loader2 className="h-6 w-6 animate-spin text-[#FF6B00]" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,#171717_0%,#0D0D0D_55%,#090909_100%)] px-6 py-6 font-mono text-white">
			<div className="mb-6 flex items-end justify-between gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-[#161616] to-[#0F0F0F] px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
				<div>
					<p className="text-[11px] uppercase tracking-[0.3em] text-gray-500">Live troubleshooting</p>
					<h1 className="mt-2 text-3xl font-bold text-white">Diagonis</h1>
					<p className="mt-1 max-w-2xl text-sm leading-6 text-gray-400">
						Select robine mode, then run troubleshoot diagnosis.
					</p>
				</div>
				<div className="flex flex-col items-end gap-3">
					<div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
						<label htmlFor="robine-state" className="text-xs text-gray-400">
							Robine
						</label>
						<select
							id="robine-state"
							value={robineState}
							onChange={(e) => setRobineState(e.target.value)}
							className="rounded-md border border-white/10 bg-[#0E0E0E] px-2 py-1 text-sm text-white outline-none"
						>
							<option value="default">Default</option>
							<option value="open">Open robine</option>
						</select>
					</div>
					<button
						onClick={() => {
							setModalOpen(true);
							setIsDiagnosing(true);
							setDiagnosis({
								level: "muted",
								sourceName: source?.source_name || liveDiagnosis.sourceName,
								sensorStatus: "diagnosing",
								flowText: "Diagnosing...",
								message: "Diagnosing in progress...",
								detail: "Please wait while we analyze source and flow conditions.",
							});

							setTimeout(() => {
								setDiagnosis(buildTroubleshootDiagnosis({ source, reading, robineState }));
								setIsDiagnosing(false);
							}, 1400);
						}}
						className="inline-flex items-center gap-2 rounded-xl border border-[#FF6B00]/30 bg-[#FF6B00] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(255,107,0,0.25)] hover:bg-[#e05f00]"
					>
						<Activity className="h-4 w-4" />
						Trouble shoot
					</button>
				</div>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				<div className="rounded-3xl border border-white/10 bg-[#121212] p-5 lg:col-span-2 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
					<div className="flex items-center justify-between gap-3">
						<div>
							<div className="text-xs uppercase tracking-[0.25em] text-gray-500">Current source</div>
							<div className="mt-1 text-xl font-semibold text-white">{source?.source_name || dashboardDiagnosis.sourceName}</div>
						</div>
						<div className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${badgeStyles[dashboardDiagnosis.level]}`}>
							{dashboardDiagnosis.level === "good" ? "Healthy" : dashboardDiagnosis.level === "danger" ? "Problem" : dashboardDiagnosis.level === "warning" ? "Paused" : "Waiting"}
						</div>
					</div>

					<div className="mt-5 grid gap-3 sm:grid-cols-2">
						<div className="rounded-2xl border border-white/10 bg-black/30 p-4">
							<div className="text-[10px] uppercase tracking-[0.25em] text-gray-500">Live state</div>
							<div className="mt-2 flex items-center gap-2 text-sm text-gray-100">
								{dashboardDiagnosis.level === "good" ? (
									<ShieldCheck className="h-4 w-4 text-emerald-400" />
								) : (
									<TriangleAlert className="h-4 w-4 text-rose-400" />
								)}
								<span>{dashboardDiagnosis.message}</span>
							</div>
						</div>
						<div className="rounded-2xl border border-white/10 bg-black/30 p-4">
							<div className="text-[10px] uppercase tracking-[0.25em] text-gray-500">Last update</div>
							<div className="mt-2 text-sm text-gray-100">
								{lastUpdated ? new Date(lastUpdated).toLocaleString() : "Waiting for sensor data"}
							</div>
						</div>
					</div>
				</div>

				<div className="rounded-3xl border border-white/10 bg-[#121212] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.2)]">
					<div className="text-xs uppercase tracking-[0.25em] text-gray-500">Guidance</div>
					<div className="mt-3 space-y-3 text-sm leading-6 text-gray-300">
						<p>1. Keep robine in <span className="text-white">Default</span> for healthy green status.</p>
						<p>2. Select <span className="text-white">Open robine</span> and click <span className="text-white">Trouble shoot</span>.</p>
						<p>3. Source active + water flowing = green no problem. Source active + no flow = red problem detected.</p>
						<p>4. Source inactive = no available water in source.</p>
					</div>
				</div>
			</div>

			<Modal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				title="Troubleshoot"
				status={
					isDiagnosing
						? "Diagnosing"
						: diagnosis.level === "good"
							? "No problem detected"
							: diagnosis.level === "danger"
								? "Problem detected"
								: diagnosis.level === "warning"
									? "Source inactive"
									: "Waiting"
				}
				diagnosis={diagnosis}
				isDiagnosing={isDiagnosing}
			/>
		</div>
	);
}
