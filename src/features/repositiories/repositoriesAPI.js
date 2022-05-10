export function fetchRepositories(url){
    return fetch(url)
    .then(res => res.json());

}