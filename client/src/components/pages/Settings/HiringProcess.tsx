import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RootState } from "@/lib/slices/store";
import { useSelector } from "react-redux";

const HiringProcess = () => {
  const { steps } = useSelector((state: RootState) => state.hiringProcess);

  return (
    <>
      <h2 className="page-heading text-xl">Hiring Process</h2>

      <div className="mt-4 space-y-4">
        {steps.map((step) => (
          <Card key={step._id}>
            <CardHeader>
              <CardTitle className="capitalize">
                {step.step}. {step.title}
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default HiringProcess;
