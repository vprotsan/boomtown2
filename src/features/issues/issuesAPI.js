export function fetchIssues(url){
    return fetch(url)
    .then(res => res.json());
}