// Function to extract Fox News content 
function extractFoxNewsContent() {
    const headline = document.querySelector("h1")?.innerText || "No headline found";
    
    // Select all <p> elements inside the article-body
    const paragraphs = document.querySelectorAll(".article-body p");

    // Collect all text inside div.caption elements to exclude later
    const captions = new Set(
        Array.from(document.querySelectorAll(".article-body div.caption"))
            .map(caption => caption.innerText.trim())
    );

    // Filter out <p> elements that contain a <strong> tag or are inside a caption div
    const filteredText = Array.from(paragraphs)
        .filter(p => 
            !p.querySelector("strong") &&  // Exclude <p> elements with <strong>
            !captions.has(p.innerText.trim()) // Exclude text inside div.caption
        )
        .map(p => p.innerText.trim())
        .filter(text => text.length > 0) // Remove empty paragraphs
        .join("\n\n");

    return { headline, articleBody: filteredText || "No article content found" };
}


// Function to extract headline and article body for different sources
function extractHeadlineAndBody(selectorMap) {
    const { headlineSelector, articleSelector } = selectorMap;
    const headline = document.querySelector(headlineSelector)?.innerText || "No headline found";
    const articleBody = document.querySelector(articleSelector)?.innerText || "No article content found";
    return { headline, articleBody };
}

// Function to extract live blog content with specific elements
function extractLiveBlogContent(headlineSelector, contentSelector) {
    const headline = document.querySelector(headlineSelector)?.innerText || "No headline found";
    const elements = document.querySelectorAll(contentSelector);

    const textContent = Array.from(elements)
        .map(el => el.tagName === "H2" ? `## ${el.innerText.trim()}` : el.innerText.trim())
        .join("\n\n");

    return { headline, articleBody: textContent || "No article body content found" };
}

// Function to handle CNN extraction
function extractCNNContent() {
    if (document.querySelector(".layout-live-story__content-wrapper")) {
        return extractLiveBlogContent("h1", ".layout-live-story__main h2, .layout-live-story__main p.paragraph");
    }
    return extractHeadlineAndBody({
        headlineSelector: "h1",
        articleSelector: ".article__content"
    });
}

// Function to extract data based on domain
function extractPageData() {
    const url = window.location.href;
    const title = document.title;
    let sourceTitle = "", headline = "", articleBody = "";

    if (url.includes("cnn.com")) {
        sourceTitle = "CNN";
        ({ headline, articleBody } = extractCNNContent());

    } else if (url.includes("foxnews.com")) {
        sourceTitle = "Fox News";
        ({ headline, articleBody } = extractFoxNewsContent()); // 🔹 Using the new, precise function!

    } else if (url.includes("foxbusiness.com")) {
        sourceTitle = "Fox Business";
        ({ headline, articleBody } = extractHeadlineAndBody({
            headlineSelector: "h1",
            articleSelector: ".article-body"
        }));

    } else if (url.includes("nbcnews.com")) {
        sourceTitle = "NBC News";
        ({ headline, articleBody } = extractHeadlineAndBody({
            headlineSelector: "h1",
            articleSelector: ".article-body__content"
        }));

    } else if (url.includes("nytimes.com")) {
        sourceTitle = "The New York Times";
        if (document.querySelector('article[data-testid="live-blog-content"]')) {
            ({ headline, articleBody } = extractLiveBlogContent("h1", "h2, p.live-blog-post-content"));
        } else {
            ({ headline, articleBody } = extractHeadlineAndBody({
                headlineSelector: "h1",
                articleSelector: '[name="articleBody"]'
            }));
        }

    } else if (url.includes("wsj.com")) {
        sourceTitle = "Wall Street Journal";
        ({ headline, articleBody } = extractHeadlineAndBody({
            headlineSelector: "h1",
            articleSelector: "div.crawler section"
        }));

    } else if (url.includes("washingtonpost.com")) {
        sourceTitle = "The Washington Post";
        ({ headline, articleBody } = extractHeadlineAndBody({
            headlineSelector: "h1",
            articleSelector: ".grid-body"
        }));

    } else if (url.includes("bbc.com")) {
        sourceTitle = "BBC";
        ({ headline, articleBody } = extractLiveBlogContent("h1", "p"));
    } else if (url.includes("aljazeera.com")) {
        sourceTitle = "Al Jazeera";
        ({ headline, articleBody } = extractLiveBlogContent("h1", "p"));
    } else if (url.includes("theguardian.com")) {
        sourceTitle = "The Guardian";
        ({ headline, articleBody } = extractLiveBlogContent("h1", "p"));
    } else if (url.includes("independent.co.uk")) {
        sourceTitle = "The Independent";
        ({ headline, articleBody } = extractLiveBlogContent("h1", "p"));
    } else if (url.includes("spiegel.de")) {
        sourceTitle = "Der Spiegel";
        ({ headline, articleBody } = extractLiveBlogContent("h2", "p"));
    } else {
        sourceTitle = "";
        ({ headline, articleBody } = extractLiveBlogContent("h1", "p"));
    } 

    return { source: sourceTitle, title, url, headline, text: articleBody };
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "extractData") {
        sendResponse(extractPageData());
    }
});
