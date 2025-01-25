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
        headline = document.querySelector('h1')?.innerText || 'No H1 found'; // Get the first H1 or fallback
        articleBody = document.querySelector('.grid-body')?.innerText || 'No grid-body content found'; // Get text from grid-body
    } else if (url.includes("nytimes.com")) {
        sourceTitle = "The New York Times";
        headline = document.querySelector('h1')?.innerText || 'No headline found'; // NYT-specific H1
        articleBody = document.querySelector('[name="articleBody"]')?.innerText || 'No article body content found'; // NYT article body
    } else if (url.includes("cnn.com")) {
        sourceTitle = "CNN";
        headline = document.querySelector('h1')?.innerText || 'No H1 found'; // CNN-specific H1
        articleBody = document.querySelector('article')?.innerText || 'No article content found'; // CNN content
    } else if (url.includes("foxnews.com")) {
        sourceTitle = "Fox News";
        headline = document.querySelector('h1')?.innerText || 'No H1 found'; // FoxNews-specific H1
        articleBody = document.querySelector('.article-body')?.innerText || 'No article content found'; // FoxNews content
    } else if (url.includes("nbcnews.com")) {
        sourceTitle = "NBC News";
        headline = document.querySelector('h1')?.innerText || 'No H1 found'; // NBC News-specific H1
        articleBody = document.querySelector('.article-body__content')?.innerText || 'No article content found'; // NBC News content
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
  