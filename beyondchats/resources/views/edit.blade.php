@extends('layouts.app')

@section('content')
<div class="container py-5">
    <h2 class="text-primary mb-4">Edit Article</h2>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('articles.update', $article->id) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="mb-3">
            <label class="form-label">Title</label>
            <input type="text" name="title" class="form-control" value="{{ $article->title }}" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Slug (URL)</label>
            <input type="text" name="slug" class="form-control" value="{{ $article->slug }}" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea name="description" class="form-control" rows="4">{{ $article->description }}</textarea>
        </div>
        <button class="btn btn-warning">Update Article</button>
        <a href="{{ route('home') }}" class="btn btn-secondary ms-2">Cancel</a>
    </form>
</div>
@endsection
