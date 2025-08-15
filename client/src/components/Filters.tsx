import type { FilterConfig } from "@/utils/cardService";
import { useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface FiltersProps {
  onSearch: (filters: FilterConfig) => void;
}

export default function Filters({ onSearch }: FiltersProps) {
  const [filters, setFilters] = useState<FilterConfig>({});
  const [tagInput, setTagInput] = useState("");

  const handleInputChange = (
    field: keyof FilterConfig,
    value: string | number | string[] | boolean | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagsChange = (value: string) => {
    setTagInput(value);
    const tags = value
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0);

    handleInputChange("tags", tags.length > 0 ? tags : undefined);
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters({});
    setTagInput("");
  };

  function setPageSize(value: number): void {
    filters.pageSize = value;
  }

  return (
    <div className="p-4 bg-transparent rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Filters</h3>

      <div className="flex flex-wrap flex-col items-stretch gap-4">
        <div>
          <Label htmlFor="page-size">Page Size</Label>
          <Select onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Set Page Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="name">Card Name</Label>
          <Input
            id="name"
            placeholder="Search by name..."
            value={filters.name || ""}
            onChange={(e) =>
              handleInputChange("name", e.target.value || undefined)
            }
          />
        </div>

        <div>
          <Label htmlFor="type">Card Type</Label>
          <Select
            value={filters.type || ""}
            onValueChange={(value) =>
              handleInputChange("type", value || undefined)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="creature">Creature</SelectItem>
              <SelectItem value="spell">Spell</SelectItem>
              <SelectItem value="artifact">Artifact</SelectItem>
              <SelectItem value="objective">Objective</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            placeholder="tag1, tag2, tag3..."
            value={tagInput}
            onChange={(e) => handleTagsChange(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="offence-min">Offence (Min)</Label>
          <Input
            id="offence-min"
            type="number"
            placeholder="0"
            value={filters.offenceMin || ""}
            onChange={(e) =>
              handleInputChange(
                "offenceMin",
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
          />
        </div>

        <div>
          <Label htmlFor="offence-max">Offence (Max)</Label>
          <Input
            id="offence-max"
            type="number"
            placeholder="10"
            value={filters.offenceMax || ""}
            onChange={(e) =>
              handleInputChange(
                "offenceMax",
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
          />
        </div>

        <div>
          <Label htmlFor="defence-min">Defence (Min)</Label>
          <Input
            id="defence-min"
            type="number"
            placeholder="0"
            value={filters.defenceMin || ""}
            onChange={(e) =>
              handleInputChange(
                "defenceMin",
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
          />
        </div>

        <div>
          <Label htmlFor="defence-max">Defence (Max)</Label>
          <Input
            id="defence-max"
            type="number"
            placeholder="10"
            value={filters.defenceMax || ""}
            onChange={(e) =>
              handleInputChange(
                "defenceMax",
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
          />
        </div>

        <div>
          <Label htmlFor="regen-min">Regeneration (Min)</Label>
          <Input
            id="regen-min"
            type="number"
            placeholder="0"
            value={filters.regenerationMin || ""}
            onChange={(e) =>
              handleInputChange(
                "regenerationMin",
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
          />
        </div>

        <div>
          <Label htmlFor="regen-max">Regeneration (Max)</Label>
          <Input
            id="regen-max"
            type="number"
            placeholder="10"
            value={filters.regenerationMax || ""}
            onChange={(e) =>
              handleInputChange(
                "regenerationMax",
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="has-art"
          checked={filters.hasArt || false}
          onCheckedChange={(checked) =>
            handleInputChange("hasArt", checked || undefined)
          }
        />
        <Label htmlFor="has-art">Has artwork</Label>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Search
        </Button>
        <Button onClick={clearFilters} variant="outline">
          Clear Filters
        </Button>
      </div>
    </div>
  );
}
