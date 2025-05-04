import { SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <span className="border-foreground flex size-32 items-center justify-center rounded-full border p-2">
        <SettingsIcon className="size-24" />
      </span>
      <p className="max-w-[250px] text-center font-semibold">
        Customize your account and preferences.
      </p>
    </div>
  );
};

export default Settings;
