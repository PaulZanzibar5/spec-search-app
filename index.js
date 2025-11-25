async function runSearch() {
    const query = document.getElementById("searchBox").value;

    const endpoint = "https://<YOUR-SEARCH-SERVICE>.search.windows.net";
    const indexName = "<YOUR-INDEX-NAME>";
    const apiKey = "<YOUR-ADMIN-KEY>";

    const url = `${endpoint}/indexes/${indexName}/docs?api-version=2024-07-01-Preview&search=${encodeURIComponent(query)}`;

    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "Searching...";

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "api-key": apiKey
        }
    });

    const data = await response.json();

    if (!data.value) {
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
}
