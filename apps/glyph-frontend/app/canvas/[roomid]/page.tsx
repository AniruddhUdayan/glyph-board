import Canvas from '../../../components/canvas/Canvas';

interface CanvasPageProps {
  params: {
    roomid: string;
  };
}

export default function CanvasPage({ params }: CanvasPageProps) {
  return <Canvas roomId={params.roomid} />;
}
