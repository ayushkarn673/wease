import { Toaster } from "../ui/sonner";
import { useResolvedTheme } from "@/lib/theme";

// Pop-up notices in the theme that's showing, including a fixed Light/Dark choice from the account menu.
export default function ThemedToaster() {
  return <Toaster position="top-right" theme={useResolvedTheme()} closeButton />;
}
