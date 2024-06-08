import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import Epub from 'epub-gen';
import { format } from 'date-fns';

// replace here with whatever reddit RSS feed youd like
const redditRssUrl = 'https://www.reddit.com/popular/.rss';

// Fetch and parse the RSS feed
async function fetchRssFeed() {
    try {
        const response = await axios.get(redditRssUrl);
        const rssData = await parseStringPromise(response.data);
        return rssData;
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
    }
}

// Recursively process comments to maintain nesting, limited to 5 levels
function processComments(comments, depth = 0, maxDepth = 5) {
    if (depth > maxDepth) {
        return [];
    }

    return comments.map(comment => {
        const author = comment.data.author;
        const text = comment.data.body;
        const replies = comment.data.replies ? processComments(comment.data.replies.data.children, depth + 1, maxDepth) : [];
        return { author, text, replies };
    });
}

// Fetch comments for a given post URL
async function fetchComments(postUrl) {
    try {
        const response = await axios.get(`${postUrl}.json`);
        const postData = response.data[1].data.children;
        // Im only interested in about the first 15 top level comments or so...
        const comments = processComments(postData.slice(0,15));
        return comments;
    } catch (error) {
        console.error(`Error fetching comments for ${postUrl}:`, error);
        return [];
    }
}

// Generate HTML for comments including nested replies
function generateCommentsHtml(comments) {
    return comments.map(comment => {
        if (comment.replies.length && comment.replies[0].text != undefined) {
            return `<div style="margin-left: 20px; padding-top: 8px;"><details>
                <summary><strong>${comment.author}</strong>: ${comment.text}</summary>
                ${generateCommentsHtml(comment.replies)} </details> </div>`
        }
        return `<div style="margin-left: 20px; padding-top: 8px;">
                <strong>${comment.author}</strong>: ${comment.text}
            </div>`
    }
    ).join('');
}

// Reformat the description to have the image in a separate row
function formatDescription(description) {
    const imageRegex = /<a[^>]*> <img[^>]*> <\/a>/i;
    const imageMatch = description.match(imageRegex);

    if (imageMatch) {
        const styleRegex =/style="[^"]*"/;
        const styleMatch = imageMatch[0].match(styleRegex);
        const imageHtml = imageMatch[0].replace(styleMatch, '');
        const restHtml = description.replace(imageHtml, '').trim();
        return `<div class="img-container">
                    ${imageHtml}
                </div>
                <div style="max-height:20%;display:block;margin: 0 auto;">
                    ${restHtml}
                </div>`;
    }
    return description;
}

// Extract subreddit name from the link
function extractSubreddit(link) {
    const match = link.match(/reddit\.com\/r\/([^/]+)/);
    return match ? match[1] : 'Unknown Subreddit';
}

// Create ePub file
async function createEpub(posts) {
    const currentDate = format(new Date(), 'MMMM do, yyyy');
    const epubOptions = {
        title: `Reddit - ${currentDate}`,
        author: "Jonathan Striblet",
        cover: "./reddit_book_cover_with_date.jpg",
        appendChapterTitles: false,
        content: [],
         css: `
            * {
                font-family: verdana, arial, helvetica, sans-serif;
            }
            h1 {
                display: block;
                font-size: 18px;
                font-weight: bold;
                text-align: left;
                margin: 0.5em 0;
                overflow-wrap: anywhere !important;
                width: 100%
            }
            h4 {
                display: block;
                margin-block-start: 1em;
                margin-block-end: .5em;
                margin-inline-start: 0px;
                margin-inline-end: 0px;
                font-weight: bold;
            }
            img {
                break-inside: avoid !important;
                display: inline-block !important;
                max-height: 600px !important;
            }
            .img-container {
                display: block !important;
                text-align: center !important;
                height: 100% !important
                max-height: 600px !important;
            }
            li {
                padding-bottom: 24;
                font-size: 20;
            }
            ol {
                list-style-type: none;
                padding-left: 0;
            }
            ol > li::before {
                content: ">";
            }
            nav#toc li.table-of-content:first-child {
                display: none;
            }
            .nav-bar {
                display: block;
                font-family: monospace;
                font-size: 0.7em;
                text-align: center;
                max-height:10%;
            }
            .navbr {
                color: gray;
                display: block;
                height: 2px;
                margin: 0.5em auto;
                border: currentColor inset 1px;
            }
        `,
        tocTitle: `Reddit - ${currentDate}`,
    };

    const contentPromises = posts.map(async (post, index) => {
        let description = post.description.replace(post.title, '');
        description = formatDescription(description);
        const subreddit = extractSubreddit(post.link);
        const nextPostLink = index < posts.length - 1 ? `post_${index + 1}.xhtml` : '';
        const prevPostLink = index > 0 ? `post_${index - 1}.xhtml` : '';
        const navBar = `
            <div class="nav-bar">
                ${prevPostLink ? `| <a href="${prevPostLink}">Prev</a> |` : '|'}
               <a href="toc.xhtml">Menu</a> 
                ${nextPostLink ? `| <a href="${nextPostLink}">Next</a> |` : '|'}
                <hr class="navbr">
            </div>`;
        return {
            title: `${post.title} - r/${subreddit}`,
            data: `
                ${navBar}
                <h1>${post.title}</h1>
                <p>${description}</p> 
                ${post.comments.length ? '<h4>Comments:</h4>' : ''}
                ${generateCommentsHtml(post.comments)}
            `,
            filename: `post_${index}.xhtml`,
        };
    });

    const content = await Promise.all(contentPromises);
    epubOptions.content.push(...content);

    new Epub(epubOptions, './reddit_feed.epub').promise.then(() => {
        console.log('ePub file created successfully!');
    }).catch(err => {
        console.error('Error creating ePub file:', err);
    });
}

// Extract posts and fetch their comments
async function extractPosts(rssData) {
    const posts = await Promise.all(rssData.feed.entry.map(async entry => {
        const link = entry.link[0].$.href;
        const comments = await fetchComments(link);
        const subreddit = extractSubreddit(link);
        return {
            title: entry.title[0],
            author: entry.author[0].name[0],
            link,
            description: entry.content[0]._,
            comments,
            subreddit,
        };
    }));
    return posts;
}

// Main function
async function main() {
    const rssData = await fetchRssFeed();
    const posts = await extractPosts(rssData);
    await createEpub(posts);
}

main();
