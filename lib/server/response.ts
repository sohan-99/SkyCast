import { AxiosError } from "axios";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleApiError(error: unknown, fallbackMessage: string) {
  if (error instanceof Error && error.message === "Unauthorized") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        message: "Validation failed",
        errors: error.errors.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      },
      { status: 400 }
    );
  }

  if (error instanceof Error && error.message.startsWith("City not found:")) {
    return NextResponse.json({ message: error.message }, { status: 404 });
  }

  if (error instanceof AxiosError) {
    return NextResponse.json(
      { message: "Weather provider is temporarily unavailable" },
      { status: 502 }
    );
  }

  return NextResponse.json({ message: fallbackMessage }, { status: 500 });
}
