export function fetchMembers(url){
    return fetch(url)
    .then(res => res.json());
}