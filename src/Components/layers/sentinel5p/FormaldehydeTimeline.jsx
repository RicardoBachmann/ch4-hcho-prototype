import { useSentinelData } from "../../../hooks/useSentinelData";

export default function FormaldehydeTimeline() {
  const { collectionData, loading, error } = useSentinelData();
  console.log("Dataflow:", collectionData);
  return null;
}
