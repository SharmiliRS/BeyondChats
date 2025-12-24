<?php
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\Phase2ArticleController;

Route::apiResource('articles', ArticleController::class);

Route::get('phase2/articles', [Phase2ArticleController::class, 'index']);
Route::post('phase2/articles', [Phase2ArticleController::class, 'store']);