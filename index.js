async function runSearch() {
    console.log("runSearch fired");

    const query = document.getElementById("searchBox").value.trim();
    const resultsDiv = document.getElementById("results");

    if (!query) {
        resultsDiv.innerHTML = "Enter a search term.";
        return;
    }

    resultsDiv.innerHTML = "Searching...";

    try {
        // 🔥 CALL YOUR SECURE AZURE FUNCTION (NOT Azure Search directly)
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);

        if (!response.ok) {
            const err = await response.text();
            console.error("API error:", err);
            resultsDiv.innerHTML = `Error ${response.status}: ${err}`;
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

// 🔥 Enable hitting ENTER to search
document.getElementById("searchBox").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        runSearch();
    }
});
