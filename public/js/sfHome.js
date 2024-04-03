const searchBar = document.getElementById('header-search-bar')
const searchParams = new URLSearchParams(window.location.search);
const filter = searchParams.get("filter")

if (filter) {
    searchBar.value = filter
}

document.addEventListener('DOMContentLoaded', function() {
    const sort = document.getElementById('sf-sort-select')
    const min = document.getElementById('sf-min')
    const max = document.getElementById('sf-max')
    const order = document.getElementById('sf-order')
    const orderLabel = document.getElementById('sf-order-label')

    sort.addEventListener("change", somethingChanged)
    min.addEventListener("change", somethingChanged)
    max.addEventListener("change", somethingChanged)
    order.addEventListener("change", somethingChanged)

    function somethingChanged() {
        const xhttp = new XMLHttpRequest()        
        xhttp.open("GET", `/?sort=${sort.value}&order=${order.checked ? "asc" : "desc"}&min=${min.value}&max=${max.value}&filter=${filter}`, true)

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState != 4) {
                return
            }

            console.log(xhttp.status)
            console.log(xhttp.response)

            if (xhttp.status == 200) {
                document.write(xhttp.response) 
            }
        }

        xhttp.send()
    }
});
