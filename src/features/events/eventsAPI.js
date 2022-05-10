export function fetchEvents(url){
    return fetch(url)
    .then(res => res.json());

}