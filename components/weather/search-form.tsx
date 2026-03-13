"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { citySchema } from "@/lib/validations";

type Props = {
  onSearch: (city: string) => Promise<void>;
};

export function SearchForm({ onSearch }: Props) {
  const { register, handleSubmit, formState } = useForm<z.infer<typeof citySchema>>({
    resolver: zodResolver(citySchema),
    defaultValues: { city: "" }
  });

  const onSubmit = async (values: z.infer<typeof citySchema>) => {
    await onSearch(values.city.trim());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <Input placeholder="Search city" {...register("city")} />
      <Button type="submit" className="gap-2" disabled={formState.isSubmitting}>
        <Search className="h-4 w-4" />
        Search
      </Button>
    </form>
  );
}
