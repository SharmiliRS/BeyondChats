<!DOCTYPE html>
<html lang="en">
<head>
    <title>BeyondChats Articles</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-dark text-light">

<div class="container py-5">

    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="text-primary">BeyondChats Articles</h2>
        <div>
            <form method="POST" action="{{ route('articles.fetch') }}" class="d-inline">
                @csrf
                <button class="btn btn-outline-primary">Fetch Articles</button>
            </form>

            <a href="{{ route('articles.create') }}" class="btn btn-primary ms-2">+ Add Article</a>
        </div>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <div class="row g-4">
        @foreach($articles as $article)
            <div class="col-md-6">
                <div class="card bg-black border-primary h-100">
                    <div class="card-body">
                        <h5 class="card-title text-info">{{ $article->title }}</h5>
                        <p class="card-text text-light opacity-75">{{ $article->description ?? 'No description available' }}</p>
                        <a href="{{ $article->slug }}" target="_blank" class="text-primary">Read original →</a>
                        <div class="mt-2">
                            <a href="{{ route('articles.edit', $article->id) }}" class="btn btn-warning btn-sm">Edit</a>

                            <form action="{{ route('articles.destroy', $article->id) }}" method="POST" class="d-inline">
                                @csrf
                                @method('DELETE')
                                <button class="btn btn-danger btn-sm">Delete</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>

</div>

</body>
</html>
