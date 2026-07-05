import ProtectedRoute from "@/components/ProtectedRoute";
import StudioShell from "@/components/studio/StudioShell";

export default function Studio() {
  return (
    <ProtectedRoute>
      <StudioShell />
    </ProtectedRoute>
  );
}
