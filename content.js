// Function to extract headline and article body for different sources
function extractHeadlineAndBody(selectorMap) {
    const { headlineSelector, articleSelector } = selectorMap;
    const headline = document.querySelector(headlineSelector)?.innerText || 'No headline found';
    const articleBody = document.querySelector(articleSelector)?.innerText || 'No article content found';
    return { headline, articleBody };
}

// Function to extract live blog content with specific elements
function extractLiveBlogContent(headlineSelector, contentSelector) {
    const headline = document.querySelector(headlineSelector)?.innerText || 'No headline found';
    const elements = document.querySelectorAll(contentSelector);

    const textContent = Array.from(elements)
        .map(el => el.tagName === 'H2' ? `## ${el.innerText.trim()}` : el.innerText.trim())
        .join('\n\n');

    return { headline, articleBody: textContent || 'No article body content found' };
}

// Function to handle CNN extraction
function extractCNNContent() {
    if (document.querySelector('.layout-live-story__content-wrapper')) {
        return extractLiveBlogContent('h1', '.layout-live-story__main h2, .layout-live-story__main p.paragraph');
    }
    return extractHeadlineAndBody({
        headlineSelector: 'h1',
        articleSelector: '.article__content'
    });
}

// Function to extract data based on domain (sorted alphabetically)
function extractPageData() {
    const url = window.location.href;
    const title = document.title;
    let sourceTitle = "", headline = "", articleBody = "";

    if (url.includes("cnn.com")) {
        sourceTitle = "CNN";
        ({ headline, articleBody } = extractCNNContent());

    } else if (url.includes("foxnews.com")) {
        sourceTitle = "Fox News";
        ({ headline, articleBody } = extractHeadlineAndBody({
            headlineSelector: 'h1',
            articleSelector: '.article-body'
        }));

    } else if (url.includes("nbcnews.com")) {
        sourceTitle = "NBC News";
        ({ headline, articleBody } = extractHeadlineAndBody({
            headlineSelector: 'h1',
            articleSelector: '.article-body__content'
        }));

    } else if (url.includes("nytimes.com")) {
        sourceTitle = "The New York Times";
        if (document.querySelector('article[data-testid="live-blog-content"]')) {
            ({ headline, articleBody } = extractLiveBlogContent('h1', 'h2, p.live-blog-post-content'));
        } else {
            ({ headline, articleBody } = extractHeadlineAndBody({
                headlineSelector: 'h1',
                articleSelector: '[name="articleBody"]'
            }));
        }

    } else if (url.includes("wsj.com")) {
        sourceTitle = "Wall Street Journal";
        ({ headline, articleBody } = extractHeadlineAndBody({
            headlineSelector: 'h1',
            articleSelector: 'div.crawler section'
        }));

    } else if (url.includes("washingtonpost.com")) {
        sourceTitle = "The Washington Post";
        ({ headline, articleBody } = extractHeadlineAndBody({
            headlineSelector: 'h1',
            articleSelector: '.grid-body'
        }));
    }

    return { source: sourceTitle, title, url, headline, text: articleBody };
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'extractData') {
        sendResponse(extractPageData());
    }
});