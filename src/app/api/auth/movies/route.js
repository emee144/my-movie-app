import { NextResponse } from "next/server";
import  {Movie}  from "@/lib/models/Movie"; 
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url); 
    const genre = searchParams.get("genre"); 
    let movies;
    if (genre) {
      movies = await Movie.findAll({ where: { genre } }); 
    } else {
      movies = await Movie.findAll(); 
    }

    return NextResponse.json(movies, { status: 200 }); 
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}
