export function fetchHooks(url){
    return fetch(url)
    .then(res => res.json());
}