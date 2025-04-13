import { DataTable } from "../tables/DataTable";
import { columns } from "../tables/CandidateProfile/Columns";
import Candidates from "@/assets/data/Candidates";
import AddCandidateForm from "../forms/AddCandidateForm";

const CandidateProfiles = () => {
  return (
    <>
      <h1 className="page-heading">Candidate Profiles</h1>
      <p className="page-description">
        Add or view full CV, change status and record assessments/evaluations.
      </p>

      <DataTable
        columns={columns}
        data={Candidates}
        searchableColumns={[
          "id",
          "name",
          "email",
          "phone",
          "technology",
          "level",
          "status",
        ]}
        addDataForm={
          <>
            <AddCandidateForm />
          </>
        }
        addDataTitle="Enter candidate details and upload their CV to create a new profile."
        addDataDescription="This information will be used for screening, interview scheduling, and further recruitment steps. Make sure to fill in all relevant fields accurately."
      />
    </>
  );
};

export default CandidateProfiles;
