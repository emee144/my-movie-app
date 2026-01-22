import { NextResponse } from "next/server";
import { Movie } from "@/lib/models/Movie"; 

export async function GET(req, { params }) {
  try {
    const { id } = params; 
    const movie = await Movie.findByPk(id); 

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