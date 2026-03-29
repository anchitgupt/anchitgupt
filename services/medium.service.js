const Parser = require('rss-parser');
const parser = new Parser();

class MediumService {
    async getLatestPosts() {
        try {
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
