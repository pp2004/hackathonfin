import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface InfoTooltipProps {
  term: string;
  className?: string;
}

export function InfoTooltip({ term, className = "h-4 w-4 text-gray-400 hover:text-[var(--ubs-red)] cursor-pointer" }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: definition, isLoading } = useQuery({
    queryKey: ['/api/glossary', term],
    queryFn: async () => {
      const response = await fetch(`/api/glossary/${encodeURIComponent(term)}`);
      if (!response.ok) {
        return null;
      }
      return response.json();
    },
    enabled: isOpen,
  });

  return (
    <TooltipProvider>
      <Tooltip onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <InfoIcon className={className} />
        </TooltipTrigger>
        <TooltipContent className="max-w-80">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : definition ? (
            <div>
              <p className="font-semibold mb-1">{definition.term}</p>
              <p className="text-sm">{definition.definition}</p>
            </div>
          ) : (
            <p className="text-sm">
              {term} - Investment term. Definition not available.
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}