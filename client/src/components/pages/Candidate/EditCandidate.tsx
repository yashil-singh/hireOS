import EditCandidateForm from "@/components/forms/Candidate/EditCandidateForm";
import CandidateFormSkeleton from "@/components/skeletons/CandidateFormSkeleton";
import { useGetCandidateById } from "@/services/candidates/queries";
import { useParams } from "react-router-dom";

const EditCandidate = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useGetCandidateById(id!);

  if (isLoading) return <CandidateFormSkeleton />;
  if (isError || !data) throw new Error();

  const candidate = data.data;

  return <EditCandidateForm candidate={candidate} />;
};

export default EditCandidate;
