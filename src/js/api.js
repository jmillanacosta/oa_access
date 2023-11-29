// api.js

function get_publications(orcid, callback) {
    const api_url = `https://pub.orcid.org/v3.0/${orcid}/works`;
    const headers = { 'Accept': 'application/json' };

    fetch(api_url, { headers })
        .then(response => response.json())
        .then(data => callback(data.group))
        .catch(error => console.error('Error retrieving publications:', error));
}

function get_source_info(source, email, callback) {
    const api_url = `https://api.unpaywall.org/v2/${source}?email=${email}`;

    fetch(api_url)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(error => console.error('Error retrieving source information:', error));
}
