<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Phase2Article extends Model
{
    // Specify the table name
    protected $table = 'phase2_articles';

    // Allow mass assignment for these fields
    protected $fillable = [
        'title',
        'slug',
        'description',
        'parent_id',
    ];
}
