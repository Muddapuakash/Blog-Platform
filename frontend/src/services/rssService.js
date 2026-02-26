/**
 * Fetch raw RSS XML (DO NOT use axios here)
 */
const getRSSXML = async () => {
    const response = await fetch('http://localhost:5000/api/rss', {
        method: 'GET',
        headers: {
            'Accept': 'application/rss+xml'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch RSS feed');
    }

    return await response.text();
};

export default {
    getRSSXML
};
