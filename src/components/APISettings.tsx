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
import { ApiProviders } from "@/classes/apiProviders";

const store = new LocalStorageStore("api-settings");

const APISettings = () => {
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState(store.get("provider") || "");
  const [apiKey, setApiKey] = useState(store.get("apiKey") || "");

  useEffect(() => {
    store.set("provider", provider);
    store.set("apiKey", apiKey);
  }, [provider, apiKey]);

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
