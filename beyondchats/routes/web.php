<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticlePageController;

Route::get('/', [ArticlePageController::class, 'index'])->name('home');
Route::post('/fetch-articles', [ArticlePageController::class, 'fetch'])->name('articles.fetch');

Route::get('/articles/create', [ArticlePageController::class, 'create'])->name('articles.create');
Route::post('/articles', [ArticlePageController::class, 'store'])->name('articles.store');

Route::get('/articles/{id}/edit', [ArticlePageController::class, 'edit'])->name('articles.edit');
Route::put('/articles/{id}', [ArticlePageController::class, 'update'])->name('articles.update');
Route::delete('/articles/{id}', [ArticlePageController::class, 'destroy'])->name('articles.destroy');
