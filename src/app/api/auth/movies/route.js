// app/api/movies/route.js

import { NextResponse } from "next/server";
import { Movie } from "@/lib/models/Movie"; // Adjust the import path as needed

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url); // Extract search parameters
    const genre = searchParams.get("genre"); // Get 'genre' query parameter

    let movies;
    if (genre) {
      movies = await Movie.findAll({ where: { genre } }); // Filter movies by genre
    } else {
      movies = await Movie.findAll(); // Get all movies
    }

    return NextResponse.json(movies, { status: 200 }); // Use NextResponse for JSON response
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}