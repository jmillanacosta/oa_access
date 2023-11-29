// validation.js

function is_valid_orcid(orcid) {
    return /^\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/.test(orcid);
}

function is_valid_email(email) {
    return /^\S+@\S+\.\S+$/.test(email);
}