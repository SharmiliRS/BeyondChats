<?php

namespace App\Http\Controllers;
use App\Services\BlogScraperService;
use App\Models\Article;
use Illuminate\Http\Request;

class ScrapeController extends Controller
{
   public function fetch(BlogScraperService $scraper)
{
    $articles = $scraper->scrape();

    foreach ($articles as $article) {
        Article::updateOrCreate(
            ['slug' => $article['slug']],
            $article
        );
    }

    return redirect()->route('home');
}

}
