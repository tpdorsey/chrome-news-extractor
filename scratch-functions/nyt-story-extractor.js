(function() {
    sourceTitle = "The New York Times";

    const blogPostElement = document.querySelector('article[data-testid="live-blog-content"]');
    const results = [];

    if (blogPostElement) {
        headline = document.querySelector('h1')?.innerText || 'No headline found';

        // Select all relevant elements (h2 for subheadings and p for content)
        const elements = document.querySelectorAll('h2, p.live-blog-post-content');

        // Extract text content with Markdown headers
        const textContent = Array.from(elements)
            .map(el => el.tagName === 'H2' ? `## ${el.innerText.trim()}` : el.innerText.trim()) // Markdown for headers
            .join('\n\n'); // Double newline for better readability

        articleBody = textContent || 'No article body content found';
    } else {
        headline = document.querySelector('h1')?.innerText || 'No headline found';
        articleBody = document.querySelector('[name="articleBody"]')?.innerText || 'No article body content found';
    }

    results.push({
        source: sourceTitle, // Source title
        title: document.title, // Page title
        url: window.location.href, // Current page URL
        headline, // Extracted headline
        text: articleBody, // Extracted text from the grid body or equivalent
    });

    console.log(JSON.stringify(results, null, 2));
})();
