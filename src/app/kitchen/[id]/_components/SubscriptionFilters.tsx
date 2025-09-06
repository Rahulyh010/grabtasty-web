// components/SubscriptionFilters.tsx
import React from "react";
import { Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubscriptionFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedMealType: string;
  setSelectedMealType: (type: string) => void;
  selectedCuisine: string;
  setSelectedCuisine: (cuisine: string) => void;
  uniqueCuisines: string[];
  totalSubscriptions: number;
}

export const SubscriptionFilters: React.FC<SubscriptionFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedMealType,
  setSelectedMealType,
  selectedCuisine,
  setSelectedCuisine,
  uniqueCuisines,
  totalSubscriptions,
}) => {
  return (
    <Card className="mb-6 md:mb-8">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg md:text-xl">
              Our Subscription Plans
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Choose from our carefully crafted meal plans
            </p>
          </div>
          <Badge variant="outline" className="self-start md:self-center">
            {totalSubscriptions} plans available
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedMealType} onValueChange={setSelectedMealType}>
            <SelectTrigger>
              <SelectValue placeholder="Meal Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Meals</SelectItem>
              <SelectItem value="BREAKFAST">Breakfast</SelectItem>
              <SelectItem value="LUNCH">Lunch</SelectItem>
              <SelectItem value="DINNER">Dinner</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
            <SelectTrigger>
              <SelectValue placeholder="Cuisine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cuisines</SelectItem>
              {uniqueCuisines.map((cuisine) => (
                <SelectItem key={cuisine} value={cuisine}>
                  {cuisine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
