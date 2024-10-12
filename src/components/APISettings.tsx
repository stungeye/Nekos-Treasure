import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LocalStorageStore from "@/classes/localStorageStore";
import { ApiProviders, ApiModels } from "@/classes/apiProviders";

const store = new LocalStorageStore("neko-api-settings");
interface APISettingsProps {
  onSettingsSave: () => void; // Callback to notify when settings are saved
}

const APISettings: React.FC<APISettingsProps> = ({ onSettingsSave }) => {
  const [open, setOpen] = useState(
    !store.get("provider") || !store.get("model") || !store.get("apiKey")
  );
  const [provider, setProvider] = useState(store.get("provider") || "");
  const [model, setModel] = useState(store.get("model") || "");
  const [apiKey, setApiKey] = useState(store.get("apiKey") || "");

  const handleProviderChange = (newProvider: ApiProviders) => {
    if (provider && newProvider !== provider && apiKey.trim() !== "") {
      const confirmed = window.confirm(
        "Changing provider will reset the API key. Continue?"
      );
      if (confirmed) {
        setProvider(newProvider);
        setModel("");
        setApiKey("");
      }
    } else {
      setProvider(newProvider);
      setModel("");
    }
  };

  // Update the LocalStorageStore and trigger the onSettingsSave callback
  useEffect(() => {
    store.set("provider", provider);
    store.set("apiKey", apiKey);
    store.set("model", model);
    if (provider && model && apiKey) {
      onSettingsSave(); // Notify that the settings have been saved
    }
  }, [provider, apiKey, model, onSettingsSave]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          ⚙️
          <span className="sr-only">API Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="provider" className="text-right">
              Provider
            </label>
            <Select value={provider} onValueChange={handleProviderChange}>
              <SelectTrigger id="provider" className="col-span-3">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ApiProviders).map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="model" className="text-right">
              Model
            </label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model" className="col-span-3">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {provider && ApiModels[provider as ApiProviders] ? (
                  Object.values(ApiModels[provider as ApiProviders]).map(
                    (m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.name}
                      </SelectItem>
                    )
                  )
                ) : (
                  <SelectItem disabled key="none" value="none">
                    Select a provider first
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="apiKey" className="text-right">
              API Key
            </label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              type="password"
              className="col-span-3"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default APISettings;
