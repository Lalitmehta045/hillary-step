import { IconType } from "react-icons";

interface Activity {
  id: string;
  title: string;
  date: string;
  icon: IconType;
  iconColor: string;
  iconBg: string;
}

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-8 mb-6">
      <h2 className="text-base font-bold text-gray-900 mb-8">Activity Timeline</h2>
      
      <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="relative pl-8">
              {/* Timeline Dot/Icon */}
              <div 
                className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-[3px] border-white ${activity.iconBg} ${activity.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              
              {/* Content */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-400">
                  {activity.date}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
