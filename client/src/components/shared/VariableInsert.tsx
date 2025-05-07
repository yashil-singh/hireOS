import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoveDownLeft, Plus } from "lucide-react";
import SearchInput from "@/components/shared/SearchInput";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import DiscardChangesAlert from "../dialogs/DiscardChangesAlert";
import { useForm } from "react-hook-form";
import {
  DraftVariable,
  DraftVariableFormValues,
} from "@/services/drafts/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { draftVariableFormSchema } from "@/lib/schemas/letterSchemas";
import DynamicDialog from "../dialogs/DynamicDialog";
import DraftVariableForm from "../forms/Letter/DraftVariableForm";
import { useCreateDraftVariable } from "@/services/drafts/mutations";

const VariableInsert = ({
  onClick,
  variables,
}: {
  onClick: (key: string) => void;
  variables: DraftVariable[];
}) => {
  const [isAddingVariable, setIsAddingVariable] = useState(false);
  const [discardingAddVariable, setDiscardingAddVariable] = useState(false);
  const [isInsertingVariable, setIsInsertingVariable] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const variableForm = useForm<DraftVariableFormValues>({
    defaultValues: {
      label: "",
      description: "",
      key: "",
    },
    resolver: zodResolver(draftVariableFormSchema),
  });

  const fuse = useMemo(() => {
    return new Fuse(variables, {
      keys: ["label"],
      threshold: 0.3,
    });
  }, [variables]);

  const filteredVariables = useMemo(() => {
    if (!fuse || !searchQuery) return variables;

    return fuse.search(searchQuery).map((result) => result.item);
  }, [fuse, searchQuery, variables]);

  // Mutations
  const createDraftVariableMutation = useCreateDraftVariable();

  const onAddingVariableChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (variableForm.formState.isDirty) {
        setDiscardingAddVariable(true);
        return;
      }
    }

    setIsAddingVariable(isOpen);
    variableForm.reset();
  };

  const onCreateVariable = async (values: DraftVariableFormValues) => {
    await createDraftVariableMutation.mutateAsync(values, {
      onSuccess: () => {
        variableForm.reset();
        setIsAddingVariable(false);
      },
    });
  };

  return (
    <Popover
      open={isInsertingVariable}
      onOpenChange={setIsInsertingVariable}
      modal
    >
      <PopoverTrigger asChild>
        <Button className="w-full md:w-fit">
          <MoveDownLeft /> Insert Variable
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
        />
        <div className="no-scrollbar my-2 max-h-[300px] overflow-y-auto">
          {filteredVariables.length > 0 ? (
            filteredVariables.map((variable) => (
              <button
                key={variable._id}
                onClick={() => {
                  onClick(variable.key);
                  setIsInsertingVariable(false);
                }}
                className="hover:bg-accent w-full rounded-xl p-2 transition-colors"
              >
                <b>{variable.label}</b>
                <p className="italic">{variable.key}</p>
              </button>
            ))
          ) : (
            <p className="text-muted-foreground text-center">
              No variables found.
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setIsAddingVariable(true)}
        >
          <Plus /> Add
        </Button>
      </PopoverContent>

      <DiscardChangesAlert
        open={discardingAddVariable}
        onOpenChange={setDiscardingAddVariable}
        onConfirm={() => {
          setIsAddingVariable(false);
          variableForm.reset();
        }}
      />

      <DynamicDialog
        open={isAddingVariable}
        onOpenChange={onAddingVariableChange}
        title="Add draft variable"
        description="Add variables to be used in a draft. These variables will be pre-filled when sending a letter."
      >
        <DraftVariableForm form={variableForm} onSubmit={onCreateVariable} />
      </DynamicDialog>
    </Popover>
  );
};

export default VariableInsert;
