const Parser = require('rss-parser');
const parser = new Parser();

class MediumService {
    async getLatestPosts() {
        try {
            // Feed for Area-21. Can also use https://medium.com/feed/@username for personal
            // The user mentioned "Collaborate on some blogs which hosted in the Area-21"
            // and checking the README, let's use the Area-21 feed or his profile feed if we knew it.
            // README says: "Ask me about...".
            // Let's assume we want Area-21 for now as mentioned.
            const feed = await parser.parseURL('https://medium.com/feed/@anchitgupt2012');

            // Return top 3 posts
            return feed.items.slice(0, 3).map(item => ({
                title: item.title,
                link: item.link,
                date: new Date(item.pubDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })
            }));
        } catch (error) {
            console.error('Error fetching Medium posts:', error);
            return [];
        }
    }
}

module.exports = new MediumService();
