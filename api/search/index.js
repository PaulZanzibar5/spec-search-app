export default async function (context, req) {
    const query = req.query.query;

    if (!query) {
        context.res = {
            status: 400,
            body: "Missing ?query="
        };
        return;
    }

    const endpoint = "https://steel-spec2.search.windows.net";  // ← updated
    const indexName = "rag-1764025234671";
    const apiKey = process.env.AZURE_SEARCH_KEY;

    if (!apiKey) {
        context.res = {
            status: 500,
            body: "AZURE_SEARCH_KEY is not set in environment variables."
        };
        return;
    }

    const url =
        `${endpoint}/indexes/${indexName}/docs` +
        `?api-version=2024-07-01-Preview` +
        `&search=${encodeURIComponent(query)}` +
        `&queryType=simple`;

    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey
            }
        });

        const text = await response.text();
        let body;

        try {
            body = JSON.parse(text);
        } catch {
            body = text;
        }

        context.res = {
            status: response.status,
            body
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Search failed: " + err.message
        };
    }
}
