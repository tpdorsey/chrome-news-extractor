// Function to extract page data
function extractPageData() {
    const title = document.title; // Page title
    const url = window.location.href; // Current page URL
    let headline = "";
    let articleBody = "";
    let sourceTitle = "";

    // Apply specific query selectors based on the URL
    if (url.includes("washingtonpost.com")) {
        sourceTitle = "The Washington Post";
        headline = document.querySelector('h1')?.innerText || 'No H1 found'; 
        articleBody = document.querySelector('.grid-body')?.innerText || 'No grid-body content found'; 

    } else if (url.includes("nytimes.com")) {
        sourceTitle = "The New York Times";

        const blogPostElement = document.querySelector('article[data-testid="live-blog-content"]');

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

    } else if (url.includes("cnn.com")) {
        sourceTitle = "CNN";
        headline = document.querySelector('h1')?.innerText || 'No H1 found'; 
        articleBody = document.querySelector('.article__content')?.innerText || 'No article content found'; 

    } else if (url.includes("foxnews.com")) {
        sourceTitle = "Fox News";
        headline = document.querySelector('h1')?.innerText || 'No H1 found'; 
        articleBody = document.querySelector('.article-body')?.innerText || 'No article content found'; 

    } else if (url.includes("nbcnews.com")) {
        sourceTitle = "NBC News";
        headline = document.querySelector('h1')?.innerText || 'No H1 found'; 
        articleBody = document.querySelector('.article-body__content')?.innerText || 'No article content found'; 

    } else if (url.includes("wsj.com")) {
        sourceTitle = "Wall Street Journal";
        headline = document.querySelector('h1')?.innerText || 'No H1 found'; 
        articleBody = document.querySelector('div.crawler section')?.innerText || 'No article content found'; 
    }

    return {
        source: sourceTitle, // Source title
        title, // Page title
        url, // Current page URL
        headline, // Extracted headline
        text: articleBody, // Extracted text from the grid body or equivalent
    };
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'extractData') {
        const data = extractPageData();
        sendResponse(data);
    }
});
