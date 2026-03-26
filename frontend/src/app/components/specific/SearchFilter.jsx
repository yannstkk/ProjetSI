import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export function SearchFilter({
                                 searchPlaceholder = "Rechercher...",
                                 searchValue = "",
                                 onSearchChange,
                                 filters = [],
                                 activeFilters = [],
                                 onRemoveFilter,
                                 onClearAll
                             }) {
    return (
        <div className="space-y-4">

            {/* Barre recherche + filtres */}
            <div className="flex items-center gap-3">

                {/* Recherche */}
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <Input
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="pl-10"
                    />

                </div>

                {/* Filtres */}
                {filters.map((filter) => (
                    <Select
                        key={filter.id}
                        value={filter.value}
                        onValueChange={filter.onChange}
                    >

                        <SelectTrigger className="w-48">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4" />
                                <SelectValue placeholder={filter.label} />
                            </div>
                        </SelectTrigger>

                        <SelectContent>
                            {filter.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>

                    </Select>
                ))}

            </div>

            {/* Filtres actifs */}
            {activeFilters.length > 0 && (

                <div className="flex items-center gap-2 flex-wrap">

          <span className="text-sm text-gray-600">
            Filtres actifs :
          </span>

                    {activeFilters.map((filter) => (
                        <Badge
                            key={filter.id}
                            variant="secondary"
                            className="gap-1 cursor-pointer hover:bg-gray-200"
                            onClick={() => onRemoveFilter?.(filter.id)}
                        >

              <span>
                {filter.label}: {filter.value}
              </span>

                            <X className="w-3 h-3" />

                        </Badge>
                    ))}

                    <button
                        onClick={onClearAll}
                        className="text-sm text-blue-600 hover:text-blue-700 ml-2"
                    >
                        Tout effacer
                    </button>

                </div>

            )}

        </div>
    );
}