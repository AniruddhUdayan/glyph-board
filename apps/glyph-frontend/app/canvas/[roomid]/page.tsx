import Canvas from '../../../components/canvas/Canvas';
import ProtectedRoute from '../../../components/ProtectedRoute';

interface CanvasPageProps {
  params: {
    roomid: string;
  };
}

export default function CanvasPage({ params }: CanvasPageProps) {
  return (
    <ProtectedRoute requireAuth={true}>
      <Canvas roomId={params.roomid} />
    </ProtectedRoute>
  );
}
