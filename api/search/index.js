export default async function (context, req) {
    const query = req.query.query;

    if (!query) {
        context.res = {
            status: 400,
            body: "Missing ?query="
        };
        return;
    }

    const endpoint = "https://steel-spec.search.windows.net";
   const indexName = "rag-1764025234671";

    const apiKey = process.env.AZURE_SEARCH_KEY;

    const url =
        `${endpoint}/indexes/${indexName}/docs?api-version=2024-07-01-Preview&search=${encodeURIComponent(query)}&queryType=simple`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey
            }
        });

        const data = await response.json();
        context.res = { status: 200, body: data };

    } catch (err) {
        context.res = { status: 500, body: "Search failed: " + err.toString() };
    }
}
