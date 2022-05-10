export function fetchMember(url){
    return fetch(url).then(res => res.json());
}