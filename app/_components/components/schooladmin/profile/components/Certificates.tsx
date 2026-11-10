import { Award, Download } from "lucide-react";

type Certificate = {
  id: string;
  title: string;
  issuedDate: string;
  issuedBy: string | null;
  certificateUrl: string | null;
};

type Props = {
  certificates?: Certificate[];
};

export const Certificates = ({ certificates = [] }: Props) => {
  const displayData = certificates.length > 0 ? certificates : [];

  return (
    <div className="bg-elev-1 border border-line rounded-2xl p-5 sm:p-6 shadow-card overflow-hidden min-w-0">
      <h3 className="text-[15px] font-semibold flex items-center gap-2.5 mb-5 text-fg">
        <Award className="w-6 h-6 text-primary flex-shrink-0" />
        Certificates
      </h3>
      
      {displayData.length === 0 ? (
        <div className="py-8 text-center text-fg-subtle text-sm">No certificates</div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {displayData.map((c) => (
          <div
            key={c.id}
            className="bg-elev-1 border border-line rounded-2xl p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center transition-all hover:bg-elev-3 min-w-0"
          >
            <div className="flex gap-3 sm:gap-4 items-start sm:items-center min-w-0 flex-1">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                <Award size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-bold text-fg leading-tight break-words">{c.title}</p>
                <p className="text-xs text-fg-muted mt-1">
                  Issued on {new Date(c.issuedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <a
              href={c.certificateUrl ?? "#"}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-muted hover:text-primary p-2 transition-colors touch-manipulation min-h-[44px] min-w-[44px] inline-flex items-center justify-center self-end sm:self-center flex-shrink-0"
              aria-label="Download"
            >
              <Download size={20} />
            </a>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};