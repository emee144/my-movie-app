// app/api/movies/[id]/route.js

import { NextResponse } from "next/server";
import { Movie } from "@/lib/models/Movie"; // Adjusted to match the consistent import path

export async function GET(req, { params }) {
  try {
    const { id } = params; // Extract the movie id from the URL
    const movie = await Movie.findByPk(id); // Fetch movie by primary key

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(movie, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch movie:", error);
    return NextResponse.json(
      { error: "Failed to fetch movie" },
      { status: 500 }
    );
  }
}