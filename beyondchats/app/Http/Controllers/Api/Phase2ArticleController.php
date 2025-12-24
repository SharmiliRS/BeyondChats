<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Phase2Article;
use Illuminate\Http\Request;

class Phase2ArticleController extends Controller
{
    public function index()
    {
        return Phase2Article::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $article = Phase2Article::create([
            'title'       => $request->title,
            'slug'        => $request->slug,
            'description' => $request->description,
            'parent_id'   => $request->parent_id,
        ]);

        return response()->json($article, 201);
    }
}
