export async function getAllCategory() {
    var promise = fetch('http://localhost:8080/category', {
        method: 'GET'
    }).then(data =>  data.json());
    return promise;
}