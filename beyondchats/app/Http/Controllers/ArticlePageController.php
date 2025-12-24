<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use App\Services\BlogScraperService;

class ArticlePageController extends Controller
{
    public function index() {
        $articles = Article::latest()->get();
        return view('home', compact('articles'));
    }

    public function fetch(BlogScraperService $scraper) {
        $articlesData = $scraper->scrape();

        foreach ($articlesData as $data) {
            Article::updateOrCreate(
                ['slug' => $data['slug']],
                ['title' => $data['title'], 'description' => $data['description']]
            );
        }

        return redirect()->route('home')->with('success', 'Articles fetched successfully!');
    }

    public function create() {
        return view('create');
    }

    public function store(Request $request) {
        $request->validate([
            'title' => 'required|string',
            'slug' => 'required|string|unique:articles',
            'description' => 'nullable|string'
        ]);

        Article::create($request->all());

        return redirect()->route('home')->with('success', 'Article added successfully!');
    }

    public function edit($id) {
        $article = Article::findOrFail($id);
        return view('edit', compact('article'));
    }

    public function update(Request $request, $id) {
        $request->validate([
            'title' => 'required|string',
            'slug' => 'required|string|unique:articles,slug,'.$id,
            'description' => 'nullable|string'
        ]);

        $article = Article::findOrFail($id);
        $article->update($request->all());

        return redirect()->route('home')->with('success', 'Article updated successfully!');
    }

    public function destroy($id) {
        $article = Article::findOrFail($id);
        $article->delete();

        return redirect()->route('home')->with('success', 'Article deleted successfully!');
    }
}
