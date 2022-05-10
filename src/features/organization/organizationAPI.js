export function fetchOrganization(){

    const organizationApiUrl = process.env.REACT_APP_API_URL;
    return fetch(organizationApiUrl).then(res => res.json());
}