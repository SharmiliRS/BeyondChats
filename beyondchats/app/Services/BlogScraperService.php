<?php

namespace App\Services;

use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;

class BlogScraperService
{
public function scrape()
{
    $client = new Client(['timeout' => 10]);
    $articles = [];

    // Fetch the initial page
    $html = $client->get('https://beyondchats.com/blogs/')->getBody()->getContents();
    $crawler = new Crawler($html);

       // Get last page URL safely
$lastPageNode = $crawler->filter('.pagination a')->last();
$lastPageUrl = $lastPageNode->count() ? 'https://beyondchats.com' . $lastPageNode->attr('href') : 'https://beyondchats.com/blogs/';

// Fetch last page HTML
$lastHtml = $client->get($lastPageUrl)->getBody()->getContents();
$lastCrawler = new Crawler($lastHtml);

// Loop over blog cards safely
$lastCrawler->filter('.blog-card')->slice(0, 5)->each(function ($node) use (&$articles, $client) {

    // Title
    $title = $node->filter('h2')->count() ? trim($node->filter('h2')->text()) : 'No Title';

    // Link
    $slug = $node->filter('a')->count() ? $node->filter('a')->attr('href') : '#';
    $url = 'https://beyondchats.com' . $slug;

    // Description
    $articleHtml = $client->get($url)->getBody()->getContents();
    $articleCrawler = new Crawler($articleHtml);

    $description = $articleCrawler->filter('p')->count()
        ? trim($articleCrawler->filter('p')->first()->text())
        : 'No description available';

    $articles[] = [
        'title' => $title,
        'slug' => $url,
        'description' => $description,
    ];
});


        return $articles;
    }
}
