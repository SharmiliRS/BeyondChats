<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article;

class ArticleController extends Controller
{
    public function index() {
        return response()->json(Article::all(), 200);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string',
            'slug' => 'required|unique:articles|string',
            'description' => 'nullable|string'
        ]);

        $article = Article::create($validated);

        return response()->json($article, 201);
    }

    public function show($id) {
        $article = Article::findOrFail($id);
        return response()->json($article, 200);
    }

    public function update(Request $request, $id) {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string',
            'slug' => 'required|string|unique:articles,slug,' . $id,
            'description' => 'nullable|string'
        ]);

        $article->update($validated);

        return response()->json($article, 200);
    }

    public function destroy($id) {
        $article = Article::findOrFail($id);
        $article->delete();

        return response()->json(['message' => 'Article deleted successfully'], 200);
    }
}
