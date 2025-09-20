import Canvas from '../../../components/canvas/Canvas';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default async function CanvasPage({ params, searchParams }: { params?: Promise<{ roomid: string }>; searchParams?: Promise<any> }) {
  const resolvedParams = params ? await params : undefined;
  const roomId = resolvedParams?.roomid ?? '';
  return (
    <ProtectedRoute requireAuth={true}>
      <Canvas roomId={roomId} />
    </ProtectedRoute>
  );
}
