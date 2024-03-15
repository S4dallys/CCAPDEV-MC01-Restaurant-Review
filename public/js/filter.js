const searchBar = document.getElementById('header-search-bar')
const searchParams = new URLSearchParams(window.location.search);
const filter = searchParams.get("filter")

if (filter) {
    searchBar.value = filter
}
