import { Alert } from "../../types";
import { mergeClasses } from "../../utils";

const Alerts: React.FC<{
	alerts: Alert[];
}> = ({ alerts }) => {
	return (
		<>
			{alerts.length > 0 && (
				<section className="fixed bottom-4 right-4 max-w-xs z-10 w-full flex flex-col gap-2 pointer-events-none select-none">
					{alerts.map((alert, index) => (
						<div
							className={mergeClasses([
								"flex flex-row gap-2 shadow-lg rounded-md p-4 border",
								alert.type === "error"
									? "border-red-500 bg-red-50 text-red-600"
									: "border-green-500 bg-green-50 text-green-600",
							])}
							key={index}
						>
							<div className="flex-grow flex items-center gap-2">
								<div className="w-5 h-5 bg-current rounded-md animate-pulse"></div>
								<h4 className="text-current">{alert.message}</h4>
							</div>
						</div>
					))}
				</section>
			)}
		</>
	);
};

export default Alerts;
