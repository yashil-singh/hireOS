import Candidates from "@/assets/data/Candidates";
import BackButton from "@/components/shared/BackButton";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Technologies } from "@/lib/constants";
import { useState } from "react";

const SendLetter = () => {
  const [content, setContent] = useState("");
  return (
    <div className="small-container space-y-4">
      <BackButton />

      <div>
        <h1 className="page-heading">Send Letter</h1>
        <p className="page-description">
          Select a letter template, customize its content if needed, and send it
          to one or more candidates.
        </p>
      </div>

      <Label>Candidates</Label>
      {/* <MultiSelect
        className="h-12 w-full"
        options={Technologies}
        // onValueChange={field.onChange}
        // defaultValue={field.value}
        placeholder="Select technologies"
        variant="inverted"
        maxCount={8}
        // error={!!form.formState.errors.technology}
      /> */}

      <Label>Draft</Label>
      {/* <Combobox
        placeholder="Select Candidate"
        options={[
          {
            label: "Peter Parker - peter@gmail.com",
            value: "candidate-1",
          },
          {
            label: "Marry Jane - marry@gmail.com",
            value: "candidate-2",
          },
        ]}
        // value={field.value}
        // setValue={field.onChange}
        // error={!!form.formState.errors.candidate}
      /> */}

      <Label>Content</Label>
      <RichTextEditor
        content={content}
        onChange={setContent}
        className="no-scrollbar max-h-[60vh] overflow-y-auto"
      />

      <Button className="w-full">Send</Button>
    </div>
  );
};

export default SendLetter;
