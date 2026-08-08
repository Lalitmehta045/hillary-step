import { IconType } from "react-icons";

interface KpiCardProps {
  title: string;
  value: string | number;
  percentageChange: number;
  icon: IconType;
  iconColorClass?: string;
  iconBgClass?: string;
}

export function KpiCard({
  title,
  value,
  percentageChange,
  icon: Icon,
  iconColorClass = "text-blue-600",
  iconBgClass = "bg-blue-50",
}: KpiCardProps) {
  const isPositive = percentageChange > 0;
  const isNegative = percentageChange < 0;

  return (
    <div className="bg-white rounded-md border border-gray-200 p-6 flex flex-col justify-between h-[168px]">
      <div className="flex justify-between items-start">
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider w-24">
          {title}
        </h3>
        <div className={`p-2 rounded-md ${iconBgClass} ${iconColorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        <div className="flex items-center text-xs">
          <span
            className={`font-medium mr-1 ${
              isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-gray-500"
            }`}
          >
            {isPositive ? "↗" : isNegative ? "↘" : ""}
            {isPositive ? "+" : ""}
            {percentageChange}%
          </span>
          <span className="text-gray-400">this month</span>
        </div>
      </div>
    </div>
  );
}
