async function runSearch() {
    console.log("runSearch fired"); // debug

    const query = document.getElementById("searchBox").value.trim();
    if (!query) {
        document.getElementById("results").innerHTML = "Enter a search term.";
        return;
    }

    const endpoint = "https://steel-spec.search.windows.net";      // <-- YOUR SEARCH SERVICE
    const indexName = "doc-index";                                 // <-- YOUR INDEX NAME
    const apiKey = "YOUR-ADMIN-OR-QUERY-KEY-HERE";                // <-- YOUR KEY

    const url =
        `${endpoint}/indexes/${indexName}/docs` +
        `?api-version=2024-07-01-Preview` +
        `&search=${encodeURIComponent(query)}` +
        `&queryType=simple`;  // SLOW issues fixed by switching to simple

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "Searching...";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey,
            }
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("Search error:", text);
            resultsDiv.innerHTML = `Error: ${response.status}<br>${text}`;
            return;
        }

        const data = await response.json();

        if (!data.value || data.value.length === 0) {
            resultsDiv.innerHTML = "No results.";
            return;
        }

        resultsDiv.innerHTML = "";

        data.value.forEach(doc => {
            const div = document.createElement("div");
            div.className = "result";
            div.innerHTML = `
                <strong>${doc.id}</strong><br>
                ${doc.content ? doc.content.substring(0, 200) + "..." : ""}
            `;
            resultsDiv.appendChild(div);
        });

    } catch (err) {
        console.error("Fetch failed:", err);
        resultsDiv.innerHTML = "Search failed. Check console.";
    }
}
