@extends('layouts.app')

@section('content')
<div class="container py-5">
    <h2 class="text-primary mb-4">Add New Article</h2>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('articles.store') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label class="form-label">Title</label>
            <input type="text" name="title" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Slug (URL)</label>
            <input type="text" name="slug" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea name="description" class="form-control" rows="4"></textarea>
        </div>
        <button class="btn btn-primary">Add Article</button>
        <a href="{{ route('home') }}" class="btn btn-secondary ms-2">Cancel</a>
    </form>
</div>
@endsection
