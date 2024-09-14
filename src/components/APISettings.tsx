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

const APISettings = () => {
  const [open, setOpen] = useState(
    !store.get("provider") || !store.get("model") || !store.get("apiKey")
  );
  const [provider, setProvider] = useState(store.get("provider") || "");
  const [model, setModel] = useState(store.get("model") || "");
  const [apiKey, setApiKey] = useState(store.get("apiKey") || "");

  useEffect(() => {
    if (store.get("provider") !== provider) {
      setModel(""); // Reset model when provider changes
      setApiKey(""); // Reset API key when provider changes
    }

    store.set("provider", provider);
    store.set("apiKey", apiKey);
    store.set("model", model);
  }, [provider, apiKey, model]);

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
            <Select value={provider} onValueChange={setProvider}>
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
                {Object.values(ApiModels[provider as ApiProviders]).map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.name}
                  </SelectItem>
                ))}
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
