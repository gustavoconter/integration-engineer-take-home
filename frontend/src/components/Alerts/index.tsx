import { Alert } from "../../types";

const Alerts: React.FC<{
	alerts: Alert[];
}> = ({ alerts }) => {
	return (
		<>
			{alerts.length > 0 && (
				<section className="fixed bottom-4 right-4 max-w-xs z-10 w-full flex flex-col gap-2 pointer-events-none select-none">
					{alerts.map((alert, index) => (
						<div
							className="flex flex-row gap-2 shadow-lg rounded-md p-4 bg-red-50 border border-red-200"
							key={index}
						>
							<div className="flex-grow flex items-center gap-2">
								<div className="w-5 h-5 bg-red-400 rounded-md"></div>
								<span className="text-red-500">{alert.message}</span>
							</div>
						</div>
					))}
				</section>
			)}
		</>
	);
};

export default Alerts;