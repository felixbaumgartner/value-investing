import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";

function App() {
  return (
    <TooltipProvider>
      <Index />
    </TooltipProvider>
  );
}

export default App;
