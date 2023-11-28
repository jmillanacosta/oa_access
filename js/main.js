// main.js


function fetchAndPrint() {
    const email = document.getElementById('email').value;
    const orcid = document.getElementById('orcid').value;

    if (!is_valid_email(email) || !is_valid_orcid(orcid)) {
        alert('Invalid ORCID or email format. Please check and retry.');
        return;
    }

    get_publications(orcid, publications => {
        const resultsTable = document.getElementById('resultsTable');
        resultsTable.innerHTML = '<tr><th>Title</th><th>DOI</th><th>PMID</th><th>PMCID</th><th>Source</th><th>License Type</th><th>OA Status</th></tr>'; // Clear previous results

        if (publications) {
            publications.forEach(publication => {
                printPublicationInfo(publication, email, resultsTable);
            });
        }

        // Initialize DataTable after content is generated
        $(resultsTable).DataTable({
            "paging": true,
            "pageLength": 15,

        });
    });
}

function printPublicationInfo(publication, email, resultsTable) {
    const title = publication['work-summary'][0]['title']['title']['value'];
    const source = publication['external-ids']['external-id'][0]['external-id-value'];
    const source_source = publication['external-ids']['external-id'][0]['external-id-source'];

    // Check if the source is a valid DOI
    const doiPattern = /^(https:\/\/doi\.org\/)?(10\.\d{4,}\/\S+)$/;
    const doiMatches = source.match(doiPattern);
    const doiColumn = doiMatches ? `<td><a href="https://doi.org/${doiMatches[0]}" target="_blank">${doiMatches[2]}</a></td>` : '<td></td>';

    // Check if the source is a valid PMID
    const pmidPattern = /^\d+$/;
    const pmidColumn = pmidPattern.test(source) ? `<td><a href="https://www.ncbi.nlm.nih.gov/pubmed/${source}" target="_blank">${source}</a></td>` : '<td></td>';

    // Check if the source is a valid PMCID
    const pmcidPattern = /^PMC(\d+)$/;
    const pmcidMatches = source.match(pmcidPattern);
    const pmcidColumn = pmcidMatches ? `<td><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC/${pmcidMatches[1]}" target="_blank">${source}</a></td>` : '<td></td>';

    // Display in the 'Source' column if it's neither a DOI, PMID, nor PMCID
    const sourceColumn = (!doiMatches && !pmidPattern.test(source) && !pmcidMatches) ?
        `<td><a href="${source}" target="_blank">${source}</a></td>` : '<td></td>';

    get_source_info(source, email, sourceInfo => {
        const oaStatus = sourceInfo ? sourceInfo['oa_status'] || 'Not available' : 'Not available';
        const bestOALocation = sourceInfo ? sourceInfo['best_oa_location'] || {} : {};
        const licenseType = bestOALocation['license'] || 'Unknown';

        const row = `<tr><td>${title}</td>${doiColumn}${pmidColumn}${pmcidColumn}${sourceColumn}<td>${licenseType}</td><td>${oaStatus}</td></tr>`;
        resultsTable.innerHTML += row;
    });
}
