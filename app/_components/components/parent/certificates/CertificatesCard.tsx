import { AlertCircle, Clock, File } from "lucide-react";

const CertificatesCard = () => {
  const infoItems = [
    {
      icon: Clock,
      title: "Processing Time",
      description: "Typically 5–7 working days",
    },
    {
      icon: File,
      title: "Required Documents",
      description: "Submit valid ID and request form",
    },
    {
      icon: AlertCircle,
      title: "Important Note",
      description: "Incomplete forms may delay approval",
    },
  ];

  return (
    <div
      className="p-4 lg:p-6 
                 bg-elev-1 
                 
                 border border-line 
                 rounded-2xl 
                 shadow-card"
    >
      <div className="flex flex-col lg:flex-row items-start gap-4">

        {/* Left Main Icon */}
        <div className="p-3 bg-primary/20 rounded-full border border-primary/30 flex-shrink-0">
          <AlertCircle className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-4">

          {/* Heading */}
          <div>
            <h3 className="font-bold text-fg text-sm lg:text-lg">
              Important Information
            </h3>
            <span className="inline-block mt-1 px-3 py-1 
                             bg-primary/20 
                             text-primary 
                             rounded-full 
                             text-xs font-semibold 
                             border border-primary/30">
              Read Carefully
            </span>
          </div>

          {/* Info Items */}
          <div className="space-y-3">
            {infoItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="bg-elev-1 
                             
                             border border-primary/30 
                             rounded-2xl 
                             p-3 lg:p-4 
                             flex items-start gap-3"
                >
                  <div className="p-2 bg-elev-2 rounded-full">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>

                  <div>
                    <div className="font-semibold text-fg text-xs lg:text-sm">
                      {item.title}
                    </div>
                    <div className="text-xs text-fg-muted">
                      {item.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CertificatesCard;
